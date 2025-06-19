// MCP Prompts implementation for interactive templates

import { Prompt, PromptMessage } from '@modelcontextprotocol/sdk/types.js';
import Handlebars from 'handlebars';
import { EnhancedPromptCache } from './enhancedCache.js';
import { MCPPrompt } from './types.js';

export class PromptTemplates {
  private cache: EnhancedPromptCache;
  private handlebars: typeof Handlebars;

  constructor(cache: EnhancedPromptCache) {
    this.cache = cache;
    this.handlebars = Handlebars.create();
    this.registerHelpers();
  }

  /**
   * Register Handlebars helpers
   */
  private registerHelpers(): void {
    // Helper to join arrays
    this.handlebars.registerHelper('join', (array: any[], separator: string) => {
      return Array.isArray(array) ? array.join(separator) : '';
    });

    // Helper for conditional rendering
    this.handlebars.registerHelper('eq', (a: any, b: any) => a === b);
    
    // Helper to lowercase text
    this.handlebars.registerHelper('lowercase', (text: string) => {
      return text ? text.toLowerCase() : '';
    });

    // Helper to uppercase text
    this.handlebars.registerHelper('uppercase', (text: string) => {
      return text ? text.toUpperCase() : '';
    });
  }

  /**
   * List all available prompt templates
   */
  async listPrompts(): Promise<Prompt[]> {
    const prompts = this.cache.getAllPrompts();
    const mcpPrompts: Prompt[] = [];

    // Convert repository prompts to MCP prompts
    for (const prompt of prompts) {
      const mcpPrompt: Prompt = {
        name: prompt.name,
        description: prompt.metadata.description || `Use the ${prompt.name} prompt template`,
      };

      // Add arguments if defined in metadata
      if (prompt.metadata.arguments && prompt.metadata.arguments.length > 0) {
        mcpPrompt.arguments = prompt.metadata.arguments.map(arg => ({
          name: arg.name,
          description: arg.description,
          required: arg.required || false,
        }));
      }

      mcpPrompts.push(mcpPrompt);
    }

    // Add built-in interactive prompts
    mcpPrompts.push(
      {
        name: 'compose_prompt',
        description: 'Compose multiple prompts together',
        arguments: [
          {
            name: 'prompts',
            description: 'Comma-separated list of prompt names to compose',
            required: true,
          },
          {
            name: 'separator',
            description: 'Text to separate prompts (default: newline)',
            required: false,
          },
        ],
      },
      {
        name: 'search_prompts',
        description: 'Search for prompts by keyword',
        arguments: [
          {
            name: 'query',
            description: 'Search query',
            required: true,
          },
          {
            name: 'limit',
            description: 'Maximum number of results (default: 5)',
            required: false,
          },
        ],
      },
      {
        name: 'suggest_prompts',
        description: 'Get AI-powered prompt suggestions',
        arguments: [
          {
            name: 'context',
            description: 'Describe what you want to accomplish',
            required: true,
          },
          {
            name: 'count',
            description: 'Number of suggestions (default: 3)',
            required: false,
          },
        ],
      }
    );

    return mcpPrompts;
  }

  /**
   * Get a specific prompt with filled template
   */
  async getPrompt(name: string, args?: Record<string, string>): Promise<PromptMessage[]> {
    // Handle built-in prompts
    switch (name) {
      case 'compose_prompt':
        return this.handleComposePrompt(args);
      case 'search_prompts':
        return this.handleSearchPrompts(args);
      case 'suggest_prompts':
        return this.handleSuggestPrompts(args);
    }

    // Handle repository prompts
    const prompt = this.cache.getPrompt(name);
    if (!prompt) {
      throw new Error(`Prompt not found: ${name}`);
    }

    // Prepare template context
    const context = {
      ...args,
      prompt_name: prompt.name,
      prompt_category: prompt.metadata.category,
      prompt_tags: prompt.metadata.tags,
    };

    // Compile and render template
    let content = prompt.content || '';
    try {
      const template = this.handlebars.compile(content);
      content = template(context);
    } catch (error) {
      console.error('Error rendering template:', error);
    }

    return [
      {
        role: 'user',
        content: {
          type: 'text',
          text: content,
        },
      },
    ];
  }

  /**
   * Handle compose_prompt built-in prompt
   */
  private async handleComposePrompt(args?: Record<string, string>): Promise<PromptMessage[]> {
    if (!args?.prompts) {
      throw new Error('prompts argument is required');
    }

    const promptNames = args.prompts.split(',').map(n => n.trim());
    const separator = args.separator || '\n\n---\n\n';
    const contents: string[] = [];

    for (const promptName of promptNames) {
      const prompt = this.cache.getPrompt(promptName);
      if (prompt && prompt.content) {
        contents.push(`# ${prompt.metadata.title || prompt.name}\n\n${prompt.content}`);
      }
    }

    return [
      {
        role: 'user',
        content: {
          type: 'text',
          text: contents.join(separator),
        },
      },
    ];
  }

  /**
   * Handle search_prompts built-in prompt
   */
  private async handleSearchPrompts(args?: Record<string, string>): Promise<PromptMessage[]> {
    if (!args?.query) {
      throw new Error('query argument is required');
    }

    const limit = parseInt(args.limit || '5', 10);
    const results = this.cache.searchPrompts(args.query).slice(0, limit);

    const content = `# Search Results for "${args.query}"

Found ${results.length} prompts:

${results.map((prompt, i) => `
${i + 1}. **${prompt.metadata.title || prompt.name}**
   - Category: ${prompt.metadata.category || 'general'}
   - Tags: ${prompt.metadata.tags?.join(', ') || 'none'}
   - Description: ${prompt.metadata.description || 'No description'}
`).join('\n')}

To use a prompt, ask for it by name.`;

    return [
      {
        role: 'assistant',
        content: {
          type: 'text',
          text: content,
        },
      },
    ];
  }

  /**
   * Handle suggest_prompts built-in prompt
   */
  private async handleSuggestPrompts(args?: Record<string, string>): Promise<PromptMessage[]> {
    if (!args?.context) {
      throw new Error('context argument is required');
    }

    const count = parseInt(args.count || '3', 10);
    
    // Simple keyword-based suggestion (could be enhanced with embeddings)
    const keywords = args.context.toLowerCase().split(/\s+/);
    const scoredPrompts = this.cache.getAllPrompts().map(prompt => {
      let score = 0;
      const searchText = `${prompt.metadata.title} ${prompt.metadata.description} ${prompt.metadata.tags?.join(' ')} ${prompt.content}`.toLowerCase();
      
      for (const keyword of keywords) {
        if (searchText.includes(keyword)) {
          score += 1;
        }
      }
      
      return { prompt, score };
    });

    const suggestions = scoredPrompts
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(s => s.prompt);

    const content = `# Suggested Prompts for: "${args.context}"

Based on your context, here are ${suggestions.length} relevant prompts:

${suggestions.map((prompt, i) => `
${i + 1}. **${prompt.metadata.title || prompt.name}**
   - Category: ${prompt.metadata.category || 'general'}
   - Description: ${prompt.metadata.description || 'No description'}
   - Relevance: High
`).join('\n')}

To use any of these prompts, just ask for it by name.`;

    return [
      {
        role: 'assistant',
        content: {
          type: 'text',
          text: content,
        },
      },
    ];
  }
}