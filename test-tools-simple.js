// Simple test for enhanced tools functionality
import { EnhancedPromptTools } from './dist/enhancedTools.js';
import { EnhancedPromptCache } from './dist/enhancedCache.js';
import { EnhancedGitHubPromptFetcher } from './dist/github-enhanced.js';
import { loadConfig } from './dist/config.js';

async function testToolsDirectly() {
  console.log('Testing Enhanced Tools Directly...\n');

  const config = loadConfig();
  const fetcher = new EnhancedGitHubPromptFetcher(config.github);
  const cache = new EnhancedPromptCache(fetcher, config);
  const tools = new EnhancedPromptTools(config.github, cache);

  try {
    // Initialize cache
    console.log('Initializing cache...');
    await cache.initialize();

    // Test tool definitions
    console.log('✓ Getting tool definitions...');
    const toolDefs = tools.getToolDefinitions();
    console.log(`Found ${toolDefs.tools.length} tools:`);
    for (const tool of toolDefs.tools) {
      console.log(`  - ${tool.name}`);
    }

    // Test help
    console.log('\n✓ Testing help tool...');
    const helpRequest = {
      params: {
        name: 'prompts_help',
        arguments: { topic: 'general' }
      }
    };
    const helpResult = await tools.handleToolCall(helpRequest);
    console.log('Help result preview:', helpResult.content[0].text.substring(0, 100) + '...');

    // Test search
    console.log('\n✓ Testing search tool...');
    const searchRequest = {
      params: {
        name: 'search_prompts',
        arguments: { query: 'api' }
      }
    };
    const searchResult = await tools.handleToolCall(searchRequest);
    console.log('Search result preview:', searchResult.content[0].text.substring(0, 100) + '...');

    // Test GitHub status
    console.log('\n✓ Testing GitHub status...');
    const statusRequest = {
      params: {
        name: 'check_github_status',
        arguments: {}
      }
    };
    const statusResult = await tools.handleToolCall(statusRequest);
    console.log('Status result:', statusResult.content[0].text);

    console.log('\n✅ All tools working correctly!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await cache.cleanup();
  }
}

testToolsDirectly().catch(console.error);