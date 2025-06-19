// MCP Resources implementation for prompt discovery

import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { EnhancedPromptCache } from './enhancedCache.js';
import { ResourceInfo } from './types.js';

export class PromptResources {
  private cache: EnhancedPromptCache;

  constructor(cache: EnhancedPromptCache) {
    this.cache = cache;
  }

  /**
   * List all available resources
   */
  async listResources(): Promise<Resource[]> {
    const resources: Resource[] = [
      {
        uri: 'prompts://list',
        name: 'All Prompts',
        description: 'List all available prompts',
        mimeType: 'application/json',
      },
      {
        uri: 'prompts://categories',
        name: 'Prompt Categories',
        description: 'List all prompt categories',
        mimeType: 'application/json',
      },
      {
        uri: 'prompts://tags',
        name: 'Prompt Tags',
        description: 'List all prompt tags',
        mimeType: 'application/json',
      },
      {
        uri: 'prompts://stats',
        name: 'Usage Statistics',
        description: 'Get prompt usage statistics',
        mimeType: 'application/json',
      },
      {
        uri: 'prompts://recent',
        name: 'Recent Prompts',
        description: 'Get recently used prompts',
        mimeType: 'application/json',
      },
    ];

    // Add category-specific resources
    const categories = this.cache.getCategories();
    for (const category of categories) {
      resources.push({
        uri: `prompts://category/${encodeURIComponent(category)}`,
        name: `${category} Prompts`,
        description: `Prompts in the ${category} category`,
        mimeType: 'application/json',
      });
    }

    return resources;
  }

  /**
   * Read a specific resource
   */
  async readResource(uri: string): Promise<string> {
    const url = new URL(uri);
    const path = url.pathname;
    const searchParams = url.searchParams;

    switch (url.host) {
      case 'list':
        return JSON.stringify({
          prompts: this.cache.getAllPrompts(),
          total: this.cache.getAllPrompts().length,
        }, null, 2);

      case 'categories':
        return JSON.stringify({
          categories: this.cache.getCategories(),
          total: this.cache.getCategories().length,
        }, null, 2);

      case 'tags':
        return JSON.stringify({
          tags: this.cache.getTags(),
          total: this.cache.getTags().length,
        }, null, 2);

      case 'stats':
        return JSON.stringify({
          stats: this.cache.getUsageStats(),
          total: this.cache.getUsageStats().length,
        }, null, 2);

      case 'recent':
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        return JSON.stringify({
          prompts: this.cache.getRecentPrompts(limit),
          limit,
        }, null, 2);

      case 'search':
        const query = searchParams.get('q') || '';
        return JSON.stringify({
          query,
          results: this.cache.searchPrompts(query),
          total: this.cache.searchPrompts(query).length,
        }, null, 2);

      case 'category':
        const category = decodeURIComponent(path.slice(1)); // Remove leading /
        return JSON.stringify({
          category,
          prompts: this.cache.getPromptsByCategory(category),
          total: this.cache.getPromptsByCategory(category).length,
        }, null, 2);

      case 'prompt':
        const promptName = decodeURIComponent(path.slice(1)); // Remove leading /
        const prompt = this.cache.getPrompt(promptName);
        if (!prompt) {
          throw new Error(`Prompt not found: ${promptName}`);
        }
        return JSON.stringify(prompt, null, 2);

      default:
        throw new Error(`Unknown resource: ${uri}`);
    }
  }

  /**
   * Subscribe to resource changes (optional)
   */
  async subscribeToResource(uri: string): Promise<void> {
    // Could implement real-time updates here
    console.error(`Subscribed to resource: ${uri}`);
  }

  /**
   * Unsubscribe from resource changes (optional)
   */
  async unsubscribeFromResource(uri: string): Promise<void> {
    // Could implement cleanup here
    console.error(`Unsubscribed from resource: ${uri}`);
  }
}