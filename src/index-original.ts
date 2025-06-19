#!/usr/bin/env node

/**
 * Main entry point for the Smart Prompts MCP server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Import our modules
import { loadConfig } from './config.js';
import { EnhancedGitHubPromptFetcher } from './github-enhanced.js';
import { EnhancedPromptCache } from './enhancedCache.js';
import { PromptResources } from './resources.js';
import { PromptTemplates } from './mcpPrompts.js';
import { PromptTools } from './tools.js';
import { PromptFileOperations } from './fileOperations.js';

// Load configuration
const config = loadConfig();

// Server info
const serverInfo = {
  name: 'smart-prompts-mcp',
  version: '2.0.0',
};

// Initialize components
const githubFetcher = new EnhancedGitHubPromptFetcher(config.github);
const cache = new EnhancedPromptCache(githubFetcher, config);
const resources = new PromptResources(cache);
const prompts = new PromptTemplates(cache);

// For backward compatibility with local file operations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localPromptsDir = path.join(__dirname, '..', 'prompts');
const fileOps = new PromptFileOperations(localPromptsDir, cache as any);
const tools = new PromptTools(fileOps);

// Create MCP server with enhanced capabilities
const server = new Server(
  serverInfo,
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// Register tool handlers (backward compatibility + new tools)
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const standardTools = tools.getToolDefinitions();
  
  // Add our new tools
  const enhancedTools = {
    tools: [
      ...standardTools.tools,
      {
        name: 'search_prompts',
        description: 'Search for prompts using keywords',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'compose_prompts',
        description: 'Compose multiple prompts together',
        inputSchema: {
          type: 'object',
          properties: {
            prompts: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of prompt names to compose',
            },
            separator: {
              type: 'string',
              description: 'Separator between prompts',
              default: '\n\n---\n\n',
            },
          },
          required: ['prompts'],
        },
      },
      {
        name: 'get_prompt_stats',
        description: 'Get usage statistics for prompts',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
  
  return enhancedTools;
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // Handle our enhanced tools
  switch (request.params.name) {
    case 'search_prompts': {
      const query = request.params.arguments?.query as string;
      const results = cache.searchPrompts(query);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    }
    
    case 'compose_prompts': {
      const promptNames = request.params.arguments?.prompts as string[];
      const separator = (request.params.arguments?.separator as string) || '\n\n---\n\n';
      const composed = promptNames
        .map(name => {
          const prompt = cache.getPrompt(name);
          return prompt ? prompt.content : null;
        })
        .filter(Boolean)
        .join(separator);
      
      return {
        content: [
          {
            type: 'text',
            text: composed,
          },
        ],
      };
    }
    
    case 'get_prompt_stats': {
      const stats = cache.getUsageStats();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(stats, null, 2),
          },
        ],
      };
    }
    
    default:
      // Fall back to standard tools
      return await tools.handleToolCall(request);
  }
});

// Register resource handlers
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const resourceList = await resources.listResources();
  return { resources: resourceList };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const content = await resources.readResource(request.params.uri);
  return {
    contents: [
      {
        uri: request.params.uri,
        mimeType: 'application/json',
        text: content,
      },
    ],
  };
});

// Register prompt handlers
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  const promptList = await prompts.listPrompts();
  return { prompts: promptList };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const messages = await prompts.getPrompt(
    request.params.name,
    request.params.arguments
  );
  return { messages };
});

/**
 * Main server startup function
 */
async function main(): Promise<void> {
  try {
    // Check GitHub access
    const isAccessible = await githubFetcher.isAccessible();
    if (!isAccessible) {
      console.error('Warning: GitHub repository not accessible. Check your configuration.');
      console.error('Repo:', `${config.github.owner}/${config.github.repo}`);
    }
    
    // Initialize cache
    await cache.initialize();
    
    // Connect to stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.error('Smart Prompts MCP Server v2.0.0 running');
    console.error(`GitHub: ${config.github.owner}/${config.github.repo}`);
    console.error(`Features: ${Object.entries(config.features)
      .filter(([_, enabled]) => enabled)
      .map(([feature]) => feature)
      .join(', ')}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to start server:', errorMessage);
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler
 */
async function shutdown(): Promise<void> {
  console.error('Shutting down server...');
  try {
    await cache.cleanup();
    console.error('Server shutdown complete');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error during shutdown:', errorMessage);
  }
  process.exit(0);
}

// Handle shutdown signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the server
main().catch((error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error('Server error:', errorMessage);
  process.exit(1);
});