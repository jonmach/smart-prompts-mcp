import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test configuration
const TEST_CONFIG = {
  GITHUB_OWNER: process.env.TEST_GITHUB_OWNER || 'jezweb',
  GITHUB_REPO: process.env.TEST_GITHUB_REPO || 'prompts',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  TEST_TIMEOUT: 30000,
  PERFORMANCE_THRESHOLD: 2000 // 2 seconds max response time
};

// Test results collector
const testResults = {
  timestamp: new Date().toISOString(),
  environment: {
    node: process.version,
    platform: process.platform,
    arch: process.arch
  },
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0
  },
  tests: [],
  performance: {
    tools: {}
  }
};

describe('Smart Prompts MCP Server Test Suite', () => {
  let client;
  let transport;

  beforeAll(async () => {
    console.log('🚀 Starting Smart Prompts MCP Server tests...\n');
    
    // Create MCP client
    transport = new StdioClientTransport({
      command: 'node',
      args: [path.join(__dirname, '..', 'dist', 'index.js')],
      env: {
        ...process.env,
        ...TEST_CONFIG
      }
    });

    client = new Client({
      name: 'test-client',
      version: '1.0.0'
    }, {
      capabilities: {}
    });

    // Connect to server
    await client.connect(transport);
    console.log('✅ Connected to MCP server\n');
  });

  afterAll(async () => {
    // Generate test reports
    await generateTestReports();
    
    // Cleanup
    if (client) {
      await client.close();
    }
  });

  describe('Core Functionality Tests', () => {
    it('should list available tools', async () => {
      const startTime = Date.now();
      const result = await client.listTools();
      const duration = Date.now() - startTime;

      expect(result.tools).toBeDefined();
      expect(result.tools.length).toBe(7);
      
      const toolNames = result.tools.map(t => t.name);
      expect(toolNames).toContain('search_prompts');
      expect(toolNames).toContain('list_prompt_categories');
      expect(toolNames).toContain('get_prompt');
      expect(toolNames).toContain('create_github_prompt');
      expect(toolNames).toContain('compose_prompts');
      expect(toolNames).toContain('prompts_help');
      expect(toolNames).toContain('check_github_status');

      recordTest('list_tools', true, duration);
    });

    it('should provide help information', async () => {
      const startTime = Date.now();
      const result = await client.callTool('prompts_help', {});
      const duration = Date.now() - startTime;

      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('Smart Prompts MCP Server');
      expect(duration).toBeLessThan(TEST_CONFIG.PERFORMANCE_THRESHOLD);

      recordTest('prompts_help', true, duration);
      recordPerformance('prompts_help', duration);
    });

    it('should check GitHub status', async () => {
      const startTime = Date.now();
      const result = await client.callTool('check_github_status', {});
      const duration = Date.now() - startTime;

      expect(result.content).toBeDefined();
      expect(result.content[0].text).toMatch(/GitHub Status.*Repository:.*Owner:/);
      
      recordTest('check_github_status', true, duration);
      recordPerformance('check_github_status', duration);
    });
  });

  describe('Search and Discovery Tests', () => {
    it('should search prompts by keyword', async () => {
      const startTime = Date.now();
      const result = await client.callTool('search_prompts', { query: 'api' });
      const duration = Date.now() - startTime;

      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      
      const text = result.content[0].text;
      expect(text).toMatch(/Found \d+ prompts? matching "api"/i);

      recordTest('search_prompts_keyword', true, duration);
      recordPerformance('search_prompts', duration);
    });

    it('should search prompts by category', async () => {
      const startTime = Date.now();
      const result = await client.callTool('search_prompts', { 
        query: 'category:development' 
      });
      const duration = Date.now() - startTime;

      expect(result.content).toBeDefined();
      expect(result.content[0].text).toContain('category:development');

      recordTest('search_prompts_category', true, duration);
    });

    it('should search prompts by tag', async () => {
      const startTime = Date.now();
      const result = await client.callTool('search_prompts', { 
        query: 'tag:api' 
      });
      const duration = Date.now() - startTime;

      expect(result.content).toBeDefined();
      expect(result.content[0].text).toContain('tag:api');

      recordTest('search_prompts_tag', true, duration);
    });

    it('should list prompt categories', async () => {
      const startTime = Date.now();
      const result = await client.callTool('list_prompt_categories', {});
      const duration = Date.now() - startTime;

      expect(result.content).toBeDefined();
      expect(result.content[0].text).toContain('📁 Prompt Categories');

      recordTest('list_prompt_categories', true, duration);
      recordPerformance('list_prompt_categories', duration);
    });
  });

  describe('Prompt Retrieval Tests', () => {
    it('should get a specific prompt', async () => {
      const startTime = Date.now();
      
      // First search for a prompt
      const searchResult = await client.callTool('search_prompts', { 
        query: 'api' 
      });
      const searchText = searchResult.content[0].text;
      
      // Extract prompt name from search results
      const promptMatch = searchText.match(/📄 ([a-z_]+) -/);
      if (promptMatch) {
        const promptName = promptMatch[1];
        
        // Get the specific prompt
        const result = await client.callTool('get_prompt', { 
          name: promptName 
        });
        const duration = Date.now() - startTime;

        expect(result.content).toBeDefined();
        expect(result.content[0].text).toContain(promptName);

        recordTest('get_prompt', true, duration);
        recordPerformance('get_prompt', duration);
      } else {
        recordTest('get_prompt', false, 0, 'No prompts found to test');
      }
    });

    it('should handle non-existent prompt gracefully', async () => {
      const startTime = Date.now();
      const result = await client.callTool('get_prompt', { 
        name: 'non_existent_prompt_12345' 
      });
      const duration = Date.now() - startTime;

      expect(result.content).toBeDefined();
      expect(result.content[0].text).toMatch(/not found|error/i);

      recordTest('get_prompt_not_found', true, duration);
    });
  });

  describe('Prompt Composition Tests', () => {
    it('should compose multiple prompts', async () => {
      const startTime = Date.now();
      
      // Search for prompts to compose
      const searchResult = await client.callTool('search_prompts', { 
        query: 'development' 
      });
      const searchText = searchResult.content[0].text;
      
      // Extract two prompt names
      const promptMatches = searchText.matchAll(/📄 ([a-z_]+) -/g);
      const prompts = Array.from(promptMatches).map(m => m[1]).slice(0, 2);
      
      if (prompts.length >= 2) {
        const result = await client.callTool('compose_prompts', { 
          prompts: prompts,
          context: 'Test composition'
        });
        const duration = Date.now() - startTime;

        expect(result.content).toBeDefined();
        expect(result.content[0].text).toContain('Composed Prompt');

        recordTest('compose_prompts', true, duration);
        recordPerformance('compose_prompts', duration);
      } else {
        recordTest('compose_prompts', false, 0, 'Not enough prompts to compose');
      }
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle empty search query', async () => {
      const startTime = Date.now();
      const result = await client.callTool('search_prompts', { query: '' });
      const duration = Date.now() - startTime;

      expect(result.content).toBeDefined();
      // Should either show all prompts or error message
      expect(result.content[0].text).toBeDefined();

      recordTest('search_empty_query', true, duration);
    });

    it('should handle invalid tool parameters', async () => {
      const startTime = Date.now();
      
      try {
        await client.callTool('get_prompt', {}); // Missing required 'name'
        recordTest('invalid_parameters', false, Date.now() - startTime, 'Should have thrown error');
      } catch (error) {
        recordTest('invalid_parameters', true, Date.now() - startTime);
      }
    });

    it('should handle special characters in search', async () => {
      const startTime = Date.now();
      const result = await client.callTool('search_prompts', { 
        query: '@#$%^&*()' 
      });
      const duration = Date.now() - startTime;

      expect(result.content).toBeDefined();
      expect(result.content[0].text).toMatch(/Found 0 prompts|No prompts found/i);

      recordTest('search_special_chars', true, duration);
    });
  });

  describe('Performance Tests', () => {
    it('should handle concurrent requests', async () => {
      const startTime = Date.now();
      
      // Send 5 concurrent requests
      const promises = [
        client.callTool('search_prompts', { query: 'api' }),
        client.callTool('list_prompt_categories', {}),
        client.callTool('prompts_help', {}),
        client.callTool('check_github_status', {}),
        client.callTool('search_prompts', { query: 'test' })
      ];

      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;

      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result.content).toBeDefined();
      });

      expect(duration).toBeLessThan(TEST_CONFIG.PERFORMANCE_THRESHOLD * 2);
      recordTest('concurrent_requests', true, duration);
    });

    it('should maintain performance under load', async () => {
      const iterations = 10;
      const timings = [];

      for (let i = 0; i < iterations; i++) {
        const startTime = Date.now();
        await client.callTool('search_prompts', { query: `test${i}` });
        timings.push(Date.now() - startTime);
      }

      const avgTime = timings.reduce((a, b) => a + b, 0) / timings.length;
      const maxTime = Math.max(...timings);

      expect(avgTime).toBeLessThan(TEST_CONFIG.PERFORMANCE_THRESHOLD);
      expect(maxTime).toBeLessThan(TEST_CONFIG.PERFORMANCE_THRESHOLD * 1.5);

      recordTest('load_test', true, avgTime, `Avg: ${avgTime}ms, Max: ${maxTime}ms`);
    });
  });

  describe('Integration Tests', () => {
    it('should complete a full workflow', async () => {
      const startTime = Date.now();
      
      // 1. Search for prompts
      const searchResult = await client.callTool('search_prompts', { 
        query: 'development' 
      });
      expect(searchResult.content).toBeDefined();

      // 2. List categories
      const categoriesResult = await client.callTool('list_prompt_categories', {});
      expect(categoriesResult.content).toBeDefined();

      // 3. Get help
      const helpResult = await client.callTool('prompts_help', {});
      expect(helpResult.content).toBeDefined();

      // 4. Check status
      const statusResult = await client.callTool('check_github_status', {});
      expect(statusResult.content).toBeDefined();

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(TEST_CONFIG.PERFORMANCE_THRESHOLD * 4);

      recordTest('full_workflow', true, duration);
    });
  });
});

// Helper functions
function recordTest(name, passed, duration, message = '') {
  testResults.tests.push({
    name,
    passed,
    duration,
    message,
    timestamp: new Date().toISOString()
  });

  testResults.summary.total++;
  if (passed) {
    testResults.summary.passed++;
  } else {
    testResults.summary.failed++;
  }
}

function recordPerformance(tool, duration) {
  if (!testResults.performance.tools[tool]) {
    testResults.performance.tools[tool] = [];
  }
  testResults.performance.tools[tool].push(duration);
}

async function generateTestReports() {
  // Calculate performance statistics
  const perfStats = {};
  for (const [tool, timings] of Object.entries(testResults.performance.tools)) {
    const sorted = timings.sort((a, b) => a - b);
    perfStats[tool] = {
      count: timings.length,
      average: Math.round(timings.reduce((a, b) => a + b, 0) / timings.length),
      median: sorted[Math.floor(sorted.length / 2)],
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)]
    };
  }
  testResults.performance.statistics = perfStats;

  // Create test-results directory
  const resultsDir = path.join(__dirname, '..', 'test-results');
  await fs.mkdir(resultsDir, { recursive: true });

  // Generate timestamp for filenames
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  // Save JSON report
  const jsonPath = path.join(resultsDir, `test-results-${timestamp}.json`);
  await fs.writeFile(jsonPath, JSON.stringify(testResults, null, 2));

  // Generate markdown report
  const markdownReport = generateMarkdownReport(testResults);
  const mdPath = path.join(resultsDir, `test-results-${timestamp}.md`);
  await fs.writeFile(mdPath, markdownReport);

  // Generate HTML report
  const htmlReport = generateHTMLReport(testResults);
  const htmlPath = path.join(resultsDir, `test-results-${timestamp}.html`);
  await fs.writeFile(htmlPath, htmlReport);

  // Create symlinks to latest results
  const latestJsonPath = path.join(resultsDir, 'latest.json');
  const latestMdPath = path.join(resultsDir, 'latest.md');
  const latestHtmlPath = path.join(resultsDir, 'latest.html');

  // Remove existing symlinks
  try {
    await fs.unlink(latestJsonPath);
    await fs.unlink(latestMdPath);
    await fs.unlink(latestHtmlPath);
  } catch (e) {
    // Ignore if files don't exist
  }

  // Create new symlinks
  await fs.symlink(path.basename(jsonPath), latestJsonPath);
  await fs.symlink(path.basename(mdPath), latestMdPath);
  await fs.symlink(path.basename(htmlPath), latestHtmlPath);

  console.log(`\n📊 Test reports generated:`);
  console.log(`   - JSON: ${jsonPath}`);
  console.log(`   - Markdown: ${mdPath}`);
  console.log(`   - HTML: ${htmlPath}`);
}

function generateMarkdownReport(results) {
  const { summary, tests, performance, environment, timestamp } = results;
  
  let report = `# Smart Prompts MCP Server Test Results\n\n`;
  report += `**Generated:** ${new Date(timestamp).toLocaleString()}\n\n`;
  report += `**Environment:** Node ${environment.node} on ${environment.platform} (${environment.arch})\n\n`;
  
  // Summary
  report += `## Summary\n\n`;
  report += `| Metric | Value |\n`;
  report += `|--------|-------|\n`;
  report += `| Total Tests | ${summary.total} |\n`;
  report += `| Passed | ✅ ${summary.passed} |\n`;
  report += `| Failed | ❌ ${summary.failed} |\n`;
  report += `| Success Rate | ${((summary.passed / summary.total) * 100).toFixed(1)}% |\n\n`;

  // Performance Statistics
  report += `## Performance Statistics\n\n`;
  report += `| Tool | Calls | Avg (ms) | Median | P95 | P99 | Max |\n`;
  report += `|------|-------|----------|--------|-----|-----|-----|\n`;
  
  for (const [tool, stats] of Object.entries(performance.statistics)) {
    report += `| ${tool} | ${stats.count} | ${stats.average} | ${stats.median} | ${stats.p95} | ${stats.p99} | ${stats.max} |\n`;
  }
  
  // Test Details
  report += `\n## Test Details\n\n`;
  report += `| Test Name | Status | Duration (ms) | Notes |\n`;
  report += `|-----------|--------|---------------|-------|\n`;
  
  for (const test of tests) {
    const status = test.passed ? '✅ Pass' : '❌ Fail';
    const notes = test.message || '-';
    report += `| ${test.name} | ${status} | ${test.duration} | ${notes} |\n`;
  }

  // Performance Chart (ASCII)
  report += `\n## Performance Chart\n\n`;
  report += '```\n';
  for (const [tool, stats] of Object.entries(performance.statistics)) {
    const bars = '█'.repeat(Math.round(stats.average / 50));
    report += `${tool.padEnd(25)} ${bars} ${stats.average}ms\n`;
  }
  report += '```\n';

  return report;
}

function generateHTMLReport(results) {
  const { summary, tests, performance, environment, timestamp } = results;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Prompts MCP Test Results - ${new Date(timestamp).toLocaleDateString()}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            background: #2563eb;
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0 0 10px 0;
        }
        .summary-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }
        .card h3 {
            margin: 0 0 10px 0;
            color: #666;
            font-size: 14px;
            text-transform: uppercase;
        }
        .card .value {
            font-size: 36px;
            font-weight: bold;
            margin: 0;
        }
        .passed { color: #10b981; }
        .failed { color: #ef4444; }
        .chart-container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        .chart-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }
        table {
            width: 100%;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        th {
            background: #f3f4f6;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        td {
            padding: 12px;
            border-top: 1px solid #e5e7eb;
        }
        tr:hover {
            background: #f9fafb;
        }
        .status-pass {
            color: #10b981;
            font-weight: 600;
        }
        .status-fail {
            color: #ef4444;
            font-weight: 600;
        }
        .footer {
            text-align: center;
            color: #666;
            margin-top: 50px;
        }
        @media (max-width: 768px) {
            .chart-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Smart Prompts MCP Server Test Results</h1>
        <p>Generated: ${new Date(timestamp).toLocaleString()}</p>
        <p>Environment: Node ${environment.node} on ${environment.platform} (${environment.arch})</p>
    </div>

    <div class="summary-cards">
        <div class="card">
            <h3>Total Tests</h3>
            <p class="value">${summary.total}</p>
        </div>
        <div class="card">
            <h3>Passed</h3>
            <p class="value passed">${summary.passed}</p>
        </div>
        <div class="card">
            <h3>Failed</h3>
            <p class="value failed">${summary.failed}</p>
        </div>
        <div class="card">
            <h3>Success Rate</h3>
            <p class="value">${((summary.passed / summary.total) * 100).toFixed(1)}%</p>
        </div>
    </div>

    <div class="chart-container">
        <h2>Test Results Overview</h2>
        <div class="chart-grid">
            <div>
                <canvas id="testChart"></canvas>
            </div>
            <div>
                <canvas id="performanceChart"></canvas>
            </div>
        </div>
    </div>

    <h2>Performance Statistics</h2>
    <table>
        <thead>
            <tr>
                <th>Tool</th>
                <th>Calls</th>
                <th>Average (ms)</th>
                <th>Median</th>
                <th>P95</th>
                <th>P99</th>
                <th>Max</th>
            </tr>
        </thead>
        <tbody>
            ${Object.entries(performance.statistics).map(([tool, stats]) => `
                <tr>
                    <td><strong>${tool}</strong></td>
                    <td>${stats.count}</td>
                    <td>${stats.average}</td>
                    <td>${stats.median}</td>
                    <td>${stats.p95}</td>
                    <td>${stats.p99}</td>
                    <td>${stats.max}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <h2>Test Details</h2>
    <table>
        <thead>
            <tr>
                <th>Test Name</th>
                <th>Status</th>
                <th>Duration (ms)</th>
                <th>Notes</th>
            </tr>
        </thead>
        <tbody>
            ${tests.map(test => `
                <tr>
                    <td><strong>${test.name}</strong></td>
                    <td class="${test.passed ? 'status-pass' : 'status-fail'}">
                        ${test.passed ? '✅ Pass' : '❌ Fail'}
                    </td>
                    <td>${test.duration}</td>
                    <td>${test.message || '-'}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="footer">
        <p>Smart Prompts MCP Server - Test Report</p>
    </div>

    <script>
        // Test Results Pie Chart
        const testCtx = document.getElementById('testChart').getContext('2d');
        new Chart(testCtx, {
            type: 'pie',
            data: {
                labels: ['Passed', 'Failed'],
                datasets: [{
                    data: [${summary.passed}, ${summary.failed}],
                    backgroundColor: ['#10b981', '#ef4444']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Test Results Distribution'
                    }
                }
            }
        });

        // Performance Bar Chart
        const perfCtx = document.getElementById('performanceChart').getContext('2d');
        const perfData = ${JSON.stringify(performance.statistics)};
        new Chart(perfCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(perfData),
                datasets: [{
                    label: 'Average Response Time (ms)',
                    data: Object.values(perfData).map(s => s.average),
                    backgroundColor: '#3b82f6'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Tool Performance'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Response Time (ms)'
                        }
                    }
                }
            }
        });
    </script>
</body>
</html>`;
}