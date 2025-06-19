// GitHub integration for fetching prompts

import { Octokit } from '@octokit/rest';
import * as yaml from 'js-yaml';
import { GitHubConfig } from './config.js';
import { PromptInfo, PromptMetadata } from './types.js';

export class GitHubPromptFetcher {
  private octokit: Octokit;
  private config: GitHubConfig;

  constructor(config: GitHubConfig) {
    this.config = config;
    this.octokit = new Octokit({
      auth: config.token,
    });
  }

  /**
   * Fetch all prompts from the GitHub repository
   */
  async fetchAllPrompts(): Promise<PromptInfo[]> {
    try {
      const { data: contents } = await this.octokit.repos.getContent({
        owner: this.config.owner,
        repo: this.config.repo,
        path: this.config.path || '',
        ref: this.config.branch,
      });

      if (!Array.isArray(contents)) {
        throw new Error('Expected directory listing but got file');
      }

      const prompts: PromptInfo[] = [];
      
      // Filter for markdown files
      const markdownFiles = contents.filter(
        (file) => file.type === 'file' && file.name.endsWith('.md')
      );

      // Fetch each prompt file
      for (const file of markdownFiles) {
        try {
          const prompt = await this.fetchPrompt(file.path);
          if (prompt) {
            prompts.push(prompt);
          }
        } catch (error) {
          console.error(`Error fetching prompt ${file.path}:`, error);
        }
      }

      return prompts;
    } catch (error) {
      console.error('Error fetching prompts from GitHub:', error);
      throw error;
    }
  }

  /**
   * Fetch a single prompt by path
   */
  async fetchPrompt(path: string): Promise<PromptInfo | null> {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner: this.config.owner,
        repo: this.config.repo,
        path,
        ref: this.config.branch,
      });

      if ('content' in data && data.type === 'file') {
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        const promptInfo = this.parsePromptFile(content, path);
        return promptInfo;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching prompt ${path}:`, error);
      return null;
    }
  }

  /**
   * Parse a prompt file with YAML frontmatter
   */
  private parsePromptFile(content: string, path: string): PromptInfo {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    let metadata: PromptMetadata = {
      title: path.replace(/\.md$/, '').replace(/^.*\//, ''),
      description: '',
      category: 'general',
      tags: [],
      difficulty: 'intermediate',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };

    let promptContent = content;

    if (match) {
      // Parse YAML frontmatter
      try {
        const yamlContent = match[1];
        const parsedYaml = yaml.load(yamlContent) as any;
        
        // Map YAML fields to metadata
        if (parsedYaml.name) metadata.title = parsedYaml.name;
        if (parsedYaml.title) metadata.title = parsedYaml.title;
        if (parsedYaml.description) metadata.description = parsedYaml.description;
        if (parsedYaml.category) metadata.category = parsedYaml.category;
        if (parsedYaml.tags) metadata.tags = parsedYaml.tags;
        if (parsedYaml.difficulty) metadata.difficulty = parsedYaml.difficulty;
        if (parsedYaml.created) metadata.created = parsedYaml.created;
        if (parsedYaml.updated) metadata.updated = parsedYaml.updated;
        
        // Store arguments if present
        if (parsedYaml.arguments) {
          (metadata as any).arguments = parsedYaml.arguments;
        }

        promptContent = match[2].trim();
      } catch (error) {
        console.error('Error parsing YAML frontmatter:', error);
      }
    }

    return {
      name: metadata.title,
      content: promptContent,
      metadata,
    };
  }

  /**
   * Get repository information
   */
  async getRepoInfo() {
    try {
      const { data } = await this.octokit.repos.get({
        owner: this.config.owner,
        repo: this.config.repo,
      });
      return data;
    } catch (error) {
      console.error('Error fetching repository info:', error);
      throw error;
    }
  }

  /**
   * Check if the repository is accessible
   */
  async isAccessible(): Promise<boolean> {
    try {
      await this.getRepoInfo();
      return true;
    } catch (error) {
      return false;
    }
  }
}