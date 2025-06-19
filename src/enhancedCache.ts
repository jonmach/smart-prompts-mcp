// Enhanced cache system with GitHub integration

import { PromptInfo, UsageStats } from './types.js';
import { EnhancedGitHubPromptFetcher } from './github-enhanced.js';
import { ServerConfig } from './config.js';

export class EnhancedPromptCache {
  private prompts: Map<string, PromptInfo> = new Map();
  private promptsByCategory: Map<string, Set<string>> = new Map();
  private promptsByTag: Map<string, Set<string>> = new Map();
  private usageStats: Map<string, UsageStats> = new Map();
  private lastFetch: number = 0;
  private fetcher: EnhancedGitHubPromptFetcher;
  private config: ServerConfig;
  private refreshTimer?: NodeJS.Timeout;

  constructor(fetcher: EnhancedGitHubPromptFetcher, config: ServerConfig) {
    this.fetcher = fetcher;
    this.config = config;
  }

  /**
   * Initialize the cache and start refresh timer
   */
  async initialize(): Promise<void> {
    await this.refresh();
    
    // Set up periodic refresh
    if (this.config.cache.refreshInterval > 0) {
      this.refreshTimer = setInterval(() => {
        this.refresh().catch(console.error);
      }, this.config.cache.refreshInterval);
    }
  }

  /**
   * Refresh cache from GitHub
   */
  async refresh(): Promise<void> {
    try {
      console.error('Refreshing prompt cache from GitHub...');
      const prompts = await this.fetcher.fetchAllPrompts();
      
      // Clear existing caches
      this.prompts.clear();
      this.promptsByCategory.clear();
      this.promptsByTag.clear();

      // Populate caches
      for (const prompt of prompts) {
        this.prompts.set(prompt.name, prompt);

        // Index by category
        if (prompt.metadata.category) {
          if (!this.promptsByCategory.has(prompt.metadata.category)) {
            this.promptsByCategory.set(prompt.metadata.category, new Set());
          }
          this.promptsByCategory.get(prompt.metadata.category)!.add(prompt.name);
        }

        // Index by tags
        if (prompt.metadata.tags) {
          for (const tag of prompt.metadata.tags) {
            if (!this.promptsByTag.has(tag)) {
              this.promptsByTag.set(tag, new Set());
            }
            this.promptsByTag.get(tag)!.add(prompt.name);
          }
        }
      }

      this.lastFetch = Date.now();
      console.error(`Cache refreshed with ${prompts.length} prompts`);
    } catch (error) {
      console.error('Error refreshing cache:', error);
    }
  }

  /**
   * Get all prompts
   */
  getAllPrompts(): PromptInfo[] {
    return Array.from(this.prompts.values());
  }

  /**
   * Get a specific prompt by name
   */
  getPrompt(name: string): PromptInfo | undefined {
    const prompt = this.prompts.get(name);
    if (prompt) {
      this.trackUsage(name);
    }
    return prompt;
  }

  /**
   * Get prompts by category
   */
  getPromptsByCategory(category: string): PromptInfo[] {
    const promptNames = this.promptsByCategory.get(category);
    if (!promptNames) return [];
    
    return Array.from(promptNames)
      .map(name => this.prompts.get(name))
      .filter((p): p is PromptInfo => p !== undefined);
  }

  /**
   * Get prompts by tag
   */
  getPromptsByTag(tag: string): PromptInfo[] {
    const promptNames = this.promptsByTag.get(tag);
    if (!promptNames) return [];
    
    return Array.from(promptNames)
      .map(name => this.prompts.get(name))
      .filter((p): p is PromptInfo => p !== undefined);
  }

  /**
   * Search prompts by query
   */
  searchPrompts(query: string): PromptInfo[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllPrompts().filter(prompt => {
      const inTitle = prompt.metadata.title?.toLowerCase().includes(lowerQuery);
      const inDescription = prompt.metadata.description?.toLowerCase().includes(lowerQuery);
      const inContent = prompt.content?.toLowerCase().includes(lowerQuery);
      const inTags = prompt.metadata.tags?.some(tag => 
        tag.toLowerCase().includes(lowerQuery)
      );
      
      return inTitle || inDescription || inContent || inTags;
    });
  }

  /**
   * Get categories
   */
  getCategories(): string[] {
    return Array.from(this.promptsByCategory.keys()).sort();
  }

  /**
   * Get all tags
   */
  getTags(): string[] {
    return Array.from(this.promptsByTag.keys()).sort();
  }

  /**
   * Track usage of a prompt
   */
  private trackUsage(promptId: string): void {
    if (!this.config.features.usageTracking) return;

    const stats = this.usageStats.get(promptId) || {
      promptId,
      count: 0,
      lastUsed: new Date().toISOString(),
      ratings: [],
    };

    stats.count++;
    stats.lastUsed = new Date().toISOString();
    this.usageStats.set(promptId, stats);
  }

  /**
   * Get usage statistics
   */
  getUsageStats(): UsageStats[] {
    return Array.from(this.usageStats.values())
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get recently used prompts
   */
  getRecentPrompts(limit: number = 10): PromptInfo[] {
    const recentStats = Array.from(this.usageStats.values())
      .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
      .slice(0, limit);

    return recentStats
      .map(stat => this.prompts.get(stat.promptId))
      .filter((p): p is PromptInfo => p !== undefined);
  }

  /**
   * Clean up resources
   */
  async cleanup(): Promise<void> {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }

  /**
   * Check if cache needs refresh
   */
  needsRefresh(): boolean {
    return Date.now() - this.lastFetch > this.config.cache.ttl;
  }
}