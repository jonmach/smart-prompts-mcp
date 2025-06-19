// Enhanced GitHub integration for fetching prompts recursively

import { Octokit } from '@octokit/rest';
import * as yaml from 'js-yaml';
import { GitHubConfig } from './config.js';
import { PromptInfo, PromptMetadata } from './types.js';

export class EnhancedGitHubPromptFetcher {
  private octokit: Octokit;
  private config: GitHubConfig;

  constructor(config: GitHubConfig) {
    this.config = config;
    this.octokit = new Octokit({
      auth: config.token,
    });
  }

  /**
   * Fetch all prompts from the GitHub repository recursively
   */
  async fetchAllPrompts(): Promise<PromptInfo[]> {
    console.error('Fetching prompts recursively from GitHub...');
    const prompts: PromptInfo[] = [];
    await this.fetchPromptsRecursive(this.config.path || '', prompts);
    return prompts;
  }

  /**
   * Recursively fetch prompts from directories
   */
  private async fetchPromptsRecursive(path: string, prompts: PromptInfo[]): Promise<void> {
    try {
      const params: any = {
        owner: this.config.owner,
        repo: this.config.repo,
        path,
      };
      if (this.config.branch) {
        params.ref = this.config.branch;
      }
      
      const { data: contents } = await this.octokit.repos.getContent(params);

      if (!Array.isArray(contents)) {
        // Single file, not a directory
        return;
      }

      // Process all items in parallel
      const promises = contents.map(async (item) => {
        if (item.type === 'file' && item.name.endsWith('.md') && item.name !== 'README.md') {
          // Fetch markdown files (except README)
          try {
            const prompt = await this.fetchPrompt(item.path);
            if (prompt) {
              prompts.push(prompt);
            }
          } catch (error) {
            console.error(`Error fetching prompt ${item.path}:`, error);
          }
        } else if (item.type === 'dir' && !item.name.startsWith('.') && item.name !== 'n8n') {
          // Recursively process directories (skip hidden and n8n)
          await this.fetchPromptsRecursive(item.path, prompts);
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error(`Error fetching directory ${path}:`, error);
    }
  }

  /**
   * Fetch a single prompt by path
   */
  async fetchPrompt(path: string): Promise<PromptInfo | null> {
    try {
      const params: any = {
        owner: this.config.owner,
        repo: this.config.repo,
        path,
      };
      if (this.config.branch) {
        params.ref = this.config.branch;
      }
      
      const { data } = await this.octokit.repos.getContent(params);

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

    // Extract category from path
    const pathParts = path.split('/');
    const defaultCategory = pathParts.length > 1 ? pathParts[0] : 'general';
    const fileName = pathParts[pathParts.length - 1] || 'untitled.md';
    const defaultName = fileName.replace(/\.md$/, '').replace(/-/g, '_');

    let metadata: PromptMetadata = {
      title: defaultName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: '',
      tags: [],
      difficulty: 'intermediate',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };
    
    // Add category only if it's not undefined
    if (defaultCategory) {
      metadata.category = defaultCategory;
    }

    let promptContent = content;

    if (match) {
      // Parse YAML frontmatter
      try {
        const yamlContent = match[1];
        const parsedYaml = yaml.load(yamlContent || '') as any;
        
        // Map YAML fields to metadata
        if (parsedYaml.name) metadata.title = parsedYaml.name;
        if (parsedYaml.title) metadata.title = parsedYaml.title;
        if (parsedYaml.description) metadata.description = parsedYaml.description;
        if (parsedYaml.category) metadata.category = parsedYaml.category;
        if (parsedYaml.tags) metadata.tags = parsedYaml.tags;
        if (parsedYaml.difficulty) metadata.difficulty = parsedYaml.difficulty;
        if (parsedYaml.author) metadata.author = parsedYaml.author;
        if (parsedYaml.version) metadata.version = parsedYaml.version;
        if (parsedYaml.created) metadata.created = parsedYaml.created;
        if (parsedYaml.updated) metadata.updated = parsedYaml.updated;
        
        // Store arguments if present
        if (parsedYaml.arguments) {
          (metadata as any).arguments = parsedYaml.arguments;
        }

        // Use the name from YAML if available
        if (parsedYaml.name) {
          promptContent = match[2]?.trim() || '';
        } else {
          promptContent = match[2]?.trim() || '';
        }
      } catch (error) {
        console.error('Error parsing YAML frontmatter:', error);
      }
    }

    return {
      name: (metadata as any).name || metadata.title || defaultName,
      content: promptContent,
      metadata,
      preview: promptContent.substring(0, 200) + (promptContent.length > 200 ? '...' : ''),
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