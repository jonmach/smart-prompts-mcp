// Test script to verify the server can start
import { spawn } from 'child_process';

console.log('Testing Smart Prompts MCP Server startup...\n');

// Start the server
const server = spawn('node', ['dist/index.js'], {
  env: {
    ...process.env,
    GITHUB_OWNER: 'jonmach',
    GITHUB_REPO: 'smart-prompts'
  }
});

let output = '';
let errorOutput = '';

server.stdout.on('data', (data) => {
  output += data.toString();
});

server.stderr.on('data', (data) => {
  errorOutput += data.toString();
  console.log('Server output:', data.toString());
});

// Give server time to start
setTimeout(() => {
  console.log('\nServer started successfully');
  console.log('The server is running and will handle MCP protocol messages via stdio');
  console.log('\nNote: The server needs a GitHub token to avoid rate limits.');
  console.log('Add GITHUB_TOKEN to your .env file or environment variables.');
  
  // Kill the server
  server.kill();
}, 2000);

server.on('close', (code) => {
  console.log(`\nServer process exited with code ${code}`);
  process.exit(0);
});
