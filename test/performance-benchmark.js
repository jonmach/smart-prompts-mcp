import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Benchmark configuration
const BENCHMARK_CONFIG = {
  iterations: 100,
  warmupRuns: 10,
  tools: [
    { name: 'search_prompts', params: { query: 'api' } },
    { name: 'list_prompt_categories', params: {} },
    { name: 'get_prompt', params: { name: 'api_design' } },
    { name: 'prompts_help', params: {} },
    { name: 'check_github_status', params: {} }
  ]
};

async function runBenchmark() {
  console.log(`${colors.cyan}${colors.bright}🚀 Smart Prompts MCP Server Performance Benchmark${colors.reset}\n`);
  
  // Create transport and client
  const transport = new StdioClientTransport({
    command: 'node',
    args: [path.join(__dirname, '..', 'dist', 'index.js')],
    env: {
      GITHUB_OWNER: process.env.GITHUB_OWNER || 'jonmach',
      GITHUB_REPO: process.env.GITHUB_REPO || 'smart-prompts',
      GITHUB_TOKEN: process.env.GITHUB_TOKEN || ''
    }
  });

  const client = new Client({
    name: 'benchmark-client',
    version: '1.0.0'
  }, {
    capabilities: {}
  });

  try {
    // Connect to server
    console.log('📡 Connecting to MCP server...');
    await client.connect(transport);
    console.log(`${colors.green}✅ Connected successfully${colors.reset}\n`);

    // Warmup runs
    console.log(`🔥 Running ${BENCHMARK_CONFIG.warmupRuns} warmup iterations...`);
    for (let i = 0; i < BENCHMARK_CONFIG.warmupRuns; i++) {
      for (const tool of BENCHMARK_CONFIG.tools) {
        await client.callTool(tool.name, tool.params);
      }
    }
    console.log(`${colors.green}✅ Warmup complete${colors.reset}\n`);

    // Run benchmarks
    const results = {};
    
    for (const tool of BENCHMARK_CONFIG.tools) {
      console.log(`📊 Benchmarking ${colors.bright}${tool.name}${colors.reset}...`);
      const timings = [];
      
      for (let i = 0; i < BENCHMARK_CONFIG.iterations; i++) {
        const startTime = process.hrtime.bigint();
        await client.callTool(tool.name, tool.params);
        const endTime = process.hrtime.bigint();
        
        const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
        timings.push(duration);
        
        // Progress indicator
        if ((i + 1) % 10 === 0) {
          process.stdout.write(`\r   Progress: ${i + 1}/${BENCHMARK_CONFIG.iterations}`);
        }
      }
      
      console.log(`\r   ${colors.green}✅ Complete${colors.reset}                    `);
      
      // Calculate statistics
      timings.sort((a, b) => a - b);
      results[tool.name] = {
        min: timings[0],
        max: timings[timings.length - 1],
        average: timings.reduce((a, b) => a + b, 0) / timings.length,
        median: timings[Math.floor(timings.length / 2)],
        p95: timings[Math.floor(timings.length * 0.95)],
        p99: timings[Math.floor(timings.length * 0.99)],
        timings: timings
      };
    }

    // Display results
    console.log(`\n${colors.cyan}${colors.bright}📈 Benchmark Results${colors.reset}\n`);
    console.log('┌─────────────────────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐');
    console.log('│ Tool                    │ Min     │ Average │ Median  │ P95     │ P99     │ Max     │');
    console.log('├─────────────────────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤');
    
    for (const [tool, stats] of Object.entries(results)) {
      const row = [
        tool.padEnd(23),
        `${stats.min.toFixed(1)}ms`.padStart(7),
        `${stats.average.toFixed(1)}ms`.padStart(7),
        `${stats.median.toFixed(1)}ms`.padStart(7),
        `${stats.p95.toFixed(1)}ms`.padStart(7),
        `${stats.p99.toFixed(1)}ms`.padStart(7),
        `${stats.max.toFixed(1)}ms`.padStart(7)
      ];
      console.log(`│ ${row.join(' │ ')} │`);
    }
    console.log('└─────────────────────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘');

    // Performance chart
    console.log(`\n${colors.cyan}${colors.bright}📊 Average Response Time Chart${colors.reset}\n`);
    const maxAvg = Math.max(...Object.values(results).map(s => s.average));
    
    for (const [tool, stats] of Object.entries(results)) {
      const barLength = Math.round((stats.average / maxAvg) * 40);
      const bar = '█'.repeat(barLength);
      const color = stats.average < 200 ? colors.green : 
                   stats.average < 500 ? colors.yellow : 
                   colors.red;
      console.log(`${tool.padEnd(25)} ${color}${bar}${colors.reset} ${stats.average.toFixed(1)}ms`);
    }

    // System information
    console.log(`\n${colors.cyan}${colors.bright}💻 System Information${colors.reset}\n`);
    console.log(`Node.js: ${process.version}`);
    console.log(`Platform: ${process.platform} (${process.arch})`);
    console.log(`CPU Cores: ${require('os').cpus().length}`);
    console.log(`Memory: ${(require('os').totalmem() / 1024 / 1024 / 1024).toFixed(1)}GB`);

    // Save benchmark results
    const benchmarkDir = path.join(__dirname, '..', 'test-results', 'benchmarks');
    await fs.mkdir(benchmarkDir, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const benchmarkFile = path.join(benchmarkDir, `benchmark-${timestamp}.json`);
    
    await fs.writeFile(benchmarkFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      config: BENCHMARK_CONFIG,
      results: results,
      system: {
        node: process.version,
        platform: process.platform,
        arch: process.arch,
        cpus: require('os').cpus().length,
        memory: require('os').totalmem()
      }
    }, null, 2));

    console.log(`\n${colors.green}✅ Benchmark complete!${colors.reset}`);
    console.log(`📁 Results saved to: ${benchmarkFile}`);

    // Performance recommendations
    console.log(`\n${colors.cyan}${colors.bright}💡 Performance Recommendations${colors.reset}\n`);
    
    let recommendations = 0;
    for (const [tool, stats] of Object.entries(results)) {
      if (stats.average > 500) {
        console.log(`⚠️  ${tool}: Consider optimizing - average response time is ${stats.average.toFixed(1)}ms`);
        recommendations++;
      } else if (stats.p99 > 1000) {
        console.log(`⚠️  ${tool}: High P99 latency (${stats.p99.toFixed(1)}ms) - investigate outliers`);
        recommendations++;
      }
    }
    
    if (recommendations === 0) {
      console.log(`${colors.green}✅ All tools performing well within acceptable thresholds${colors.reset}`);
    }

  } catch (error) {
    console.error(`\n${colors.red}❌ Benchmark failed:${colors.reset}`, error);
    process.exit(1);
  } finally {
    // Cleanup
    await client.close();
  }
}

// Run benchmark
runBenchmark().catch(console.error);
