// Test MCP server functionality
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

async function testMCPServer() {
  console.log('Starting Smart Prompts MCP Server test...\n');

  // Start the server as a subprocess
  const serverProcess = spawn('node', ['dist/index.js'], {
    env: {
      ...process.env,
      GITHUB_OWNER: 'jonmach',
      GITHUB_REPO: 'smart-prompts'
    }
  });

  // Create MCP client
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['dist/index.js'],
    env: {
      GITHUB_OWNER: 'jonmach',
      GITHUB_REPO: 'smart-prompts'
    }
  });

  const client = new Client({
    name: 'test-client',
    version: '1.0.0'
  }, {
    capabilities: {}
  });

  try {
    // Connect to server
    await client.connect(transport);
    console.log('✓ Connected to server\n');

    // List available tools
    console.log('Available Tools:');
    const tools = await client.listTools();
    for (const tool of tools.tools) {
      console.log(`- ${tool.name}: ${tool.description}`);
    }
    console.log('');

    // List available resources
    console.log('Available Resources:');
    const resources = await client.listResources();
    for (const resource of resources.resources.slice(0, 10)) {
      console.log(`- ${resource.uri}: ${resource.name}`);
    }
    if (resources.resources.length > 10) {
      console.log(`  ... and ${resources.resources.length - 10} more`);
    }
    console.log('');

    // List available prompts
    console.log('Available Prompts:');
    const prompts = await client.listPrompts();
    for (const prompt of prompts.prompts.slice(0, 10)) {
      console.log(`- ${prompt.name}: ${prompt.description}`);
    }
    if (prompts.prompts.length > 10) {
      console.log(`  ... and ${prompts.prompts.length - 10} more`);
    }
    console.log('');

    // Test search functionality
    console.log('Testing search for "api":');
    const searchResult = await client.callTool('search_prompts', { query: 'api' });
    const searchData = JSON.parse(searchResult.content[0].text);
    console.log(`Found ${searchData.length} results`);
    for (const result of searchData.slice(0, 3)) {
      console.log(`- ${result.metadata.title}`);
    }

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Cleanup
    serverProcess.kill();
    await client.close();
  }
}

// Run test
testMCPServer().catch(console.error);
