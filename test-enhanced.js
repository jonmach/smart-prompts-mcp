// Test enhanced server functionality
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function testEnhancedServer() {
  console.log('Testing Enhanced Smart Prompts MCP Server v3.0...\n');

  // Create MCP client
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['dist/index.js'],
    env: {
      GITHUB_OWNER: 'jonmach',
      GITHUB_REPO: 'smart-prompts',
      GITHUB_TOKEN: process.env.GITHUB_TOKEN || ''
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
    console.log('✓ Connected to enhanced server\n');

    // List available tools
    console.log('=== Available Tools ===');
    const tools = await client.listTools();
    for (const tool of tools.tools) {
      console.log(`- ${tool.name}: ${tool.description.substring(0, 80)}${tool.description.length > 80 ? '...' : ''}`);
    }
    console.log('');

    // Test the help tool
    console.log('=== Testing prompts_help tool ===');
    const helpResult = await client.callTool('prompts_help', {});
    console.log(helpResult.content[0].text.substring(0, 300) + '...\n');

    // Test search
    console.log('=== Testing search_prompts tool ===');
    const searchResult = await client.callTool('search_prompts', { query: 'api' });
    console.log('Search results:', searchResult.content[0].text.substring(0, 300) + '...\n');

    // Test categories
    console.log('=== Testing list_prompt_categories tool ===');
    const categoriesResult = await client.callTool('list_prompt_categories', {});
    console.log(categoriesResult.content[0].text + '\n');

    // Test GitHub status
    console.log('=== Testing check_github_status tool ===');
    const statusResult = await client.callTool('check_github_status', {});
    console.log(statusResult.content[0].text + '\n');

    console.log('✅ All enhanced tools tested successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Cleanup
    await client.close();
  }
}

// Run test
testEnhancedServer().catch(console.error);
