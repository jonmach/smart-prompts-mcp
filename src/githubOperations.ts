/**
 * GitHub operations for creating and updating prompts
 */

import { Octokit } from '@octokit/rest';
import { GitHubConfig } from './config.js';
import { PromptMetadata } from './types.js';

export class GitHubPromptOperations {
  private octokit: Octokit;
  private config: GitHubConfig;

  constructor(config: GitHubConfig) {
    this.config = config;
    this.octokit = new Octokit({
      auth: config.token,
    });
  }

  /**
   * Create or update a prompt in GitHub
   */
  async savePromptToGitHub(
    path: string,
    content: string,
    message: string
  ): Promise<{ path: string; sha: string }> {
    try {
      // First, try to get the file to see if it exists
      let sha: string | undefined;
      try {
        const params: any = {
          owner: this.config.owner,
          repo: this.config.repo,
          path,
        };
        if (this.config.branch) {
          params.ref = this.config.branch;
        }
        
        const { data: existingFile } = await this.octokit.repos.getContent(params);
        if ('sha' in existingFile) {
          sha = existingFile.sha;
        }
      } catch (error: any) {
        // File doesn't exist, which is fine for creation
        if (error.status !== 404) {
          throw error;
        }
      }

      // Create or update the file
      const createParams: any = {
        owner: this.config.owner,
        repo: this.config.repo,
        path,
        message,
        content: Buffer.from(content).toString('base64'),
      };
      
      if (this.config.branch) {
        createParams.branch = this.config.branch;
      }
      
      if (sha) {
        createParams.sha = sha;
      }
      
      const { data } = await this.octokit.repos.createOrUpdateFileContents(createParams);

      return {
        path,
        sha: data.content?.sha || '',
      };
    } catch (error) {
      console.error('Error saving prompt to GitHub:', error);
      throw new Error(`Failed to save prompt to GitHub: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a prompt from GitHub
   */
  async deletePromptFromGitHub(path: string, message: string): Promise<void> {
    try {
      // Get the file SHA first
      const getParams: any = {
        owner: this.config.owner,
        repo: this.config.repo,
        path,
      };
      if (this.config.branch) {
        getParams.ref = this.config.branch;
      }
      
      const { data: file } = await this.octokit.repos.getContent(getParams);

      if (!('sha' in file)) {
        throw new Error('Could not get file SHA');
      }

      // Delete the file
      const deleteParams: any = {
        owner: this.config.owner,
        repo: this.config.repo,
        path,
        message,
        sha: file.sha,
      };
      
      if (this.config.branch) {
        deleteParams.branch = this.config.branch;
      }
      
      await this.octokit.repos.deleteFile(deleteParams);
    } catch (error) {
      console.error('Error deleting prompt from GitHub:', error);
      throw new Error(`Failed to delete prompt from GitHub: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Build a properly formatted prompt file path
   */
  buildPromptPath(category: string, filename: string): string {
    // Ensure filename ends with .md
    const mdFilename = filename.endsWith('.md') ? filename : `${filename}.md`;
    
    // Build path with category directory
    return category ? `${category}/${mdFilename}` : mdFilename;
  }

  /**
   * Format prompt content with YAML frontmatter
   */
  formatPromptContent(metadata: PromptMetadata, content: string, name: string): string {
    const frontmatter = `---
name: ${name}
title: ${metadata.title}
description: ${metadata.description}
category: ${metadata.category || 'uncategorized'}
tags: ${JSON.stringify(metadata.tags || [])}
difficulty: ${metadata.difficulty || 'intermediate'}
author: ${metadata.author || 'User'}
version: ${metadata.version || '1.0'}
created: ${metadata.created || new Date().toISOString()}
updated: ${new Date().toISOString()}${metadata.arguments ? `
arguments:${metadata.arguments.map((arg: any) => `
  - name: ${arg.name}
    description: ${arg.description}
    required: ${arg.required || false}`).join('')}` : ''}
---

${content}`;

    return frontmatter;
  }

  /**
   * Validate GitHub configuration
   */
  async validateConfig(): Promise<boolean> {
    try {
      await this.octokit.repos.get({
        owner: this.config.owner,
        repo: this.config.repo,
      });
      return true;
    } catch (error) {
      console.error('GitHub configuration validation failed:', error);
      return false;
    }
  }

  /**
   * Check if user has write access to the repository
   */
  async hasWriteAccess(): Promise<boolean> {
    try {
      if (!this.config.token) {
        return false;
      }

      const { data: repo } = await this.octokit.repos.get({
        owner: this.config.owner,
        repo: this.config.repo,
      });

      // Check if the authenticated user has push access
      return repo.permissions?.push || false;
    } catch (error) {
      console.error('Error checking write access:', error);
      return false;
    }
  }
}