#!/bin/bash

echo "🔍 Verifying Smart Prompts MCP Server Installation"
echo "================================================="
echo ""

# Check if built
echo "1. Checking build..."
if [ -d "dist" ] && [ -f "dist/index.js" ]; then
    echo "✅ Build directory exists"
else
    echo "❌ Build missing. Run: npm run build"
    exit 1
fi

# Check configuration
echo ""
echo "2. Configuration:"
echo "   GITHUB_OWNER: ${GITHUB_OWNER:-jezweb}"
echo "   GITHUB_REPO: ${GITHUB_REPO:-prompts}"
echo ""

# Test GitHub access
echo "3. Testing GitHub access..."
GITHUB_OWNER=${GITHUB_OWNER:-jezweb} GITHUB_REPO=${GITHUB_REPO:-prompts} node -e "
import { loadConfig } from './dist/config.js';
import { EnhancedGitHubPromptFetcher } from './dist/github-enhanced.js';

async function test() {
  const config = loadConfig();
  const fetcher = new EnhancedGitHubPromptFetcher(config.github);
  
  try {
    const prompts = await fetcher.fetchAllPrompts();
    console.log('✅ GitHub access successful');
    console.log('   Found', prompts.length, 'prompts');
    
    // Show categories
    const categories = new Set();
    prompts.forEach(p => {
      if (p.metadata.category) categories.add(p.metadata.category);
    });
    console.log('   Categories:', Array.from(categories).sort().join(', '));
    
    process.exit(0);
  } catch (error) {
    console.log('❌ GitHub access failed:', error.message);
    process.exit(1);
  }
}

test();
" 2>/dev/null

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation verified successfully!"
    echo ""
    echo "To use with your MCP client, add this configuration:"
    echo ""
    echo '{'
    echo '  "mcpServers": {'
    echo '    "smart-prompts": {'
    echo '      "command": "node",'
    echo '      "args": ["'$(pwd)'/dist/index.js"],'
    echo '      "env": {'
    echo '        "GITHUB_OWNER": "jezweb",'
    echo '        "GITHUB_REPO": "prompts"'
    echo '      }'
    echo '    }'
    echo '  }'
    echo '}'
else
    echo ""
    echo "❌ Installation verification failed"
fi