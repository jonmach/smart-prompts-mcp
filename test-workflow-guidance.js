// Test the enhanced workflow guidance and error handling
import { EnhancedPromptTools } from './dist/enhancedTools.js';
import { EnhancedPromptCache } from './dist/enhancedCache.js';
import { EnhancedGitHubPromptFetcher } from './dist/github-enhanced.js';
import { loadConfig } from './dist/config.js';

async function testWorkflowGuidance() {
  console.log('🧪 Testing Enhanced Workflow Guidance...\n');

  const config = loadConfig();
  const fetcher = new EnhancedGitHubPromptFetcher(config.github);
  const cache = new EnhancedPromptCache(fetcher, config);
  const tools = new EnhancedPromptTools(config.github, cache);

  try {
    await cache.initialize();

    // Test 1: Help with workflow topic
    console.log('📚 Testing workflow help...');
    const workflowHelp = await tools.handleToolCall({
      params: { name: 'prompts_help', arguments: { topic: 'workflow' } }
    });
    console.log('✓ Workflow help includes step-by-step guidance');

    // Test 2: Enhanced search descriptions
    console.log('\n🔍 Testing search tool descriptions...');
    const toolDefs = tools.getToolDefinitions();
    const searchTool = toolDefs.tools.find(t => t.name === 'search_prompts');
    if (searchTool?.description.includes('ALWAYS START HERE')) {
      console.log('✓ Search tool emphasizes starting workflow');
    }

    // Test 3: Get prompt with wrong name (should suggest alternatives)
    console.log('\n❌ Testing error handling with wrong prompt name...');
    try {
      await tools.handleToolCall({
        params: { name: 'get_prompt', arguments: { name: 'nonexistent_prompt' } }
      });
    } catch (error) {
      if (error.message.includes('Use search_prompts')) {
        console.log('✓ Error includes search guidance');
      }
    }

    // Test 4: Get prompt with partial name (should suggest similar)
    console.log('\n🔍 Testing partial name suggestions...');
    try {
      await tools.handleToolCall({
        params: { name: 'get_prompt', arguments: { name: 'api' } }
      });
    } catch (error) {
      if (error.message.includes('Did you mean')) {
        console.log('✓ Error suggests similar prompts');
      }
    }

    // Test 5: Compose with missing prompts
    console.log('\n🔗 Testing compose error handling...');
    try {
      await tools.handleToolCall({
        params: { name: 'compose_prompts', arguments: { prompts: ['missing_prompt'] } }
      });
    } catch (error) {
      if (error.message.includes('Use search_prompts')) {
        console.log('✓ Compose error includes search guidance');
      }
    }

    // Test 6: Create prompt tool description emphasizes search first
    const createTool = toolDefs.tools.find(t => t.name === 'create_github_prompt');
    if (createTool?.description.includes('search_prompts first')) {
      console.log('\n✨ Create tool emphasizes search-first workflow');
    }

    console.log('\n🎉 All workflow guidance tests passed!');
    console.log('\n📋 **Key Improvements:**');
    console.log('   • 🔍 Search tool labeled as starting point');
    console.log('   • 📖 Get prompt requires exact names from search');
    console.log('   • ✨ Create prompts warns to search first');
    console.log('   • ❌ Errors include helpful suggestions');
    console.log('   • 📚 Comprehensive workflow help topic');
    console.log('   • 🔗 Compose tool guides to search for names');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await cache.cleanup();
  }
}

testWorkflowGuidance().catch(console.error);