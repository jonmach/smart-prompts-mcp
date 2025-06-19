#!/usr/bin/env node

/**
 * Enhanced main entry point for the Smart Prompts MCP server
 * Version 3.0.0 with improved GitHub integration and AI guidance
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

// Import our modules
import { loadConfig } from './config.js';
import { EnhancedGitHubPromptFetcher } from './github-enhanced.js';
import { EnhancedPromptCache } from './enhancedCache.js';
import { PromptResources } from './resources.js';
import { PromptTemplates } from './mcpPrompts.js';
import { EnhancedPromptTools } from './enhancedTools.js';

// Load configuration
const config = loadConfig();

// Server info
const serverInfo = {
  name: 'smart-prompts-mcp',
  version: '3.0.0',
};

// Initialize components
const githubFetcher = new EnhancedGitHubPromptFetcher(config.github);
const cache = new EnhancedPromptCache(githubFetcher, config);
const resources = new PromptResources(cache);
const prompts = new PromptTemplates(cache);
const enhancedTools = new EnhancedPromptTools(config.github, cache);

// Create MCP server
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

// Register tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return enhancedTools.getToolDefinitions();
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  return await enhancedTools.handleToolCall(request);
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
      console.error('⚠️  Warning: GitHub repository not accessible. Check your configuration.');
      console.error(`   Repository: ${config.github.owner}/${config.github.repo}`);
      console.error('   Prompts will be read-only without proper GitHub access.');
    }
    
    // Initialize cache
    console.error('🔄 Initializing prompt cache...');
    await cache.initialize();
    
    // Connect to stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.error('✅ Smart Prompts MCP Server v3.0.0 running');
    console.error(`📦 GitHub: ${config.github.owner}/${config.github.repo}`);
    console.error(`🛠️  Features: ${Object.entries(config.features)
      .filter(([_, enabled]) => enabled)
      .map(([feature]) => feature)
      .join(', ')}`);
    console.error(`📚 Use 'prompts_help' tool for guidance on using this server`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Failed to start server:', errorMessage);
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler
 */
async function shutdown(): Promise<void> {
  console.error('🛑 Shutting down server...');
  try {
    await cache.cleanup();
    console.error('✅ Server shutdown complete');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error during shutdown:', errorMessage);
  }
  process.exit(0);
}

// Handle shutdown signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  shutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
  shutdown();
});

// Start the server
main().catch((error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error('❌ Server error:', errorMessage);
  process.exit(1);
});