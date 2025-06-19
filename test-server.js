// Test script for Smart Prompts MCP Server
import { EnhancedGitHubPromptFetcher } from './dist/github-enhanced.js';
import { loadConfig } from './dist/config.js';

async function test() {
  console.log('Testing Smart Prompts MCP Server...\n');
  
  const config = loadConfig();
  console.log('Configuration:', {
    owner: config.github.owner,
    repo: config.github.repo,
    branch: config.github.branch,
  });
  
  const fetcher = new EnhancedGitHubPromptFetcher(config.github);
  
  try {
    console.log('\nFetching prompts from GitHub...');
    const prompts = await fetcher.fetchAllPrompts();
    console.log(`\nFound ${prompts.length} prompts:\n`);
    
    for (const prompt of prompts) {
      console.log(`- ${prompt.name}`);
      console.log(`  Category: ${prompt.metadata.category || 'uncategorized'}`);
      console.log(`  Tags: ${prompt.metadata.tags?.join(', ') || 'none'}`);
      console.log(`  Description: ${prompt.metadata.description || 'No description'}`);
      console.log('');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test().catch(console.error);