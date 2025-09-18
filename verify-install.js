#!/usr/bin/env node

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

async function verifyInstallation() {
  console.log(`${colors.cyan}🔍 Verifying Smart Prompts MCP Server Installation...${colors.reset}\n`);

  const checks = {
    connection: false,
    tools: false,
    search: false,
    help: false,
    status: false
  };

  const transport = new StdioClientTransport({
    command: 'node',
    args: [path.join(__dirname, 'dist', 'index.js')],
    env: {
      GITHUB_OWNER: 'jonmach',
      GITHUB_REPO: 'smart-prompts',
      GITHUB_TOKEN: process.env.GITHUB_TOKEN || ''
    }
  });

  const client = new Client({
    name: 'verify-client',
    version: '1.0.0'
  }, { capabilities: {} });

  try {
    // Test 1: Connection
    process.stdout.write('1. Testing server connection... ');
    await client.connect(transport);
    checks.connection = true;
    console.log(`${colors.green}✓ Connected${colors.reset}`);

    // Test 2: List tools
    process.stdout.write('2. Checking available tools... ');
    const tools = await client.listTools();
    checks.tools = tools.tools.length === 7;
    console.log(`${colors.green}✓ Found ${tools.tools.length} tools${colors.reset}`);

    // Test 3: Search functionality
    process.stdout.write('3. Testing search functionality... ');
    const searchResult = await client.callTool('search_prompts', { query: 'test' });
    checks.search = searchResult.content && searchResult.content[0].type === 'text';
    console.log(`${colors.green}✓ Search working${colors.reset}`);

    // Test 4: Help system
    process.stdout.write('4. Testing help system... ');
    const helpResult = await client.callTool('prompts_help', {});
    checks.help = helpResult.content && helpResult.content[0].text.includes('Smart Prompts');
    console.log(`${colors.green}✓ Help available${colors.reset}`);

    // Test 5: GitHub status
    process.stdout.write('5. Testing GitHub connection... ');
    const statusResult = await client.callTool('check_github_status', {});
    checks.status = statusResult.content && statusResult.content[0].text.includes('Repository');
    console.log(`${colors.green}✓ GitHub connected${colors.reset}`);

    // Summary
    const allPassed = Object.values(checks).every(v => v);
    console.log(`\n${colors.cyan}Summary:${colors.reset}`);
    
    if (allPassed) {
      console.log(`${colors.green}✅ All tests passed! The server is properly installed and working.${colors.reset}`);
      process.exit(0);
    } else {
      console.log(`${colors.red}❌ Some tests failed. Please check your installation.${colors.reset}`);
      process.exit(1);
    }

  } catch (error) {
    console.log(`${colors.red}✗ Failed${colors.reset}`);
    console.error(`\n${colors.red}Error: ${error.message}${colors.reset}`);
    console.log('\nTroubleshooting tips:');
    console.log('1. Ensure you ran "npm install"');
    console.log('2. Ensure you ran "npm run build"');
    console.log('3. Check your Node.js version (requires 18+)');
    console.log('4. Verify your GitHub configuration in .env');
    process.exit(1);
  } finally {
    await client.close();
  }
}

verifyInstallation().catch(console.error);
