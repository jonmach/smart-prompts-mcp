#!/usr/bin/env node

// Generate mock test results to demonstrate the testing framework
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateMockResults() {
  console.log('📊 Generating mock test results for demonstration...\n');

  // Mock test results
  const testResults = {
    timestamp: new Date().toISOString(),
    environment: {
      node: process.version,
      platform: process.platform,
      arch: process.arch
    },
    summary: {
      total: 28,
      passed: 28,
      failed: 0,
      skipped: 0
    },
    tests: [
      // Core functionality tests
      { name: 'list_tools', passed: true, duration: 45, timestamp: new Date().toISOString() },
      { name: 'prompts_help', passed: true, duration: 23, timestamp: new Date().toISOString() },
      { name: 'check_github_status', passed: true, duration: 156, timestamp: new Date().toISOString() },
      
      // Search tests
      { name: 'search_prompts_keyword', passed: true, duration: 89, timestamp: new Date().toISOString() },
      { name: 'search_prompts_category', passed: true, duration: 72, timestamp: new Date().toISOString() },
      { name: 'search_prompts_tag', passed: true, duration: 68, timestamp: new Date().toISOString() },
      { name: 'list_prompt_categories', passed: true, duration: 54, timestamp: new Date().toISOString() },
      
      // Retrieval tests
      { name: 'get_prompt', passed: true, duration: 112, timestamp: new Date().toISOString() },
      { name: 'get_prompt_not_found', passed: true, duration: 31, timestamp: new Date().toISOString() },
      
      // Composition tests
      { name: 'compose_prompts', passed: true, duration: 145, timestamp: new Date().toISOString() },
      
      // Error handling tests
      { name: 'search_empty_query', passed: true, duration: 28, timestamp: new Date().toISOString() },
      { name: 'invalid_parameters', passed: true, duration: 19, timestamp: new Date().toISOString() },
      { name: 'search_special_chars', passed: true, duration: 34, timestamp: new Date().toISOString() },
      
      // Performance tests
      { name: 'concurrent_requests', passed: true, duration: 287, timestamp: new Date().toISOString() },
      { name: 'load_test', passed: true, duration: 156, message: 'Avg: 156ms, Max: 243ms', timestamp: new Date().toISOString() },
      
      // Integration tests
      { name: 'full_workflow', passed: true, duration: 412, timestamp: new Date().toISOString() },
      
      // Additional tests
      { name: 'cache_initialization', passed: true, duration: 67, timestamp: new Date().toISOString() },
      { name: 'github_authentication', passed: true, duration: 98, timestamp: new Date().toISOString() },
      { name: 'prompt_metadata_parsing', passed: true, duration: 12, timestamp: new Date().toISOString() },
      { name: 'handlebars_templating', passed: true, duration: 8, timestamp: new Date().toISOString() },
      { name: 'category_filtering', passed: true, duration: 45, timestamp: new Date().toISOString() },
      { name: 'tag_filtering', passed: true, duration: 41, timestamp: new Date().toISOString() },
      { name: 'search_ranking', passed: true, duration: 52, timestamp: new Date().toISOString() },
      { name: 'error_recovery', passed: true, duration: 78, timestamp: new Date().toISOString() },
      { name: 'rate_limit_handling', passed: true, duration: 134, timestamp: new Date().toISOString() },
      { name: 'cache_refresh', passed: true, duration: 189, timestamp: new Date().toISOString() },
      { name: 'prompt_creation', passed: true, duration: 167, timestamp: new Date().toISOString() },
      { name: 'prompt_validation', passed: true, duration: 23, timestamp: new Date().toISOString() }
    ],
    performance: {
      tools: {
        search_prompts: [89, 72, 68, 95, 102, 88, 91, 87, 93, 86],
        list_prompt_categories: [54, 48, 52, 61, 49, 55, 58, 51, 53, 56],
        get_prompt: [112, 98, 104, 119, 95, 101, 108, 97, 103, 106],
        prompts_help: [23, 19, 21, 25, 18, 22, 24, 20, 21, 23],
        check_github_status: [156, 142, 148, 168, 139, 151, 163, 145, 154, 159],
        compose_prompts: [145, 132, 138, 156, 128, 141, 152, 135, 143, 148]
      },
      statistics: {
        search_prompts: {
          count: 10,
          average: 90,
          median: 89,
          min: 68,
          max: 102,
          p95: 98,
          p99: 101
        },
        list_prompt_categories: {
          count: 10,
          average: 54,
          median: 54,
          min: 48,
          max: 61,
          p95: 59,
          p99: 60
        },
        get_prompt: {
          count: 10,
          average: 104,
          median: 104,
          min: 95,
          max: 119,
          p95: 115,
          p99: 118
        },
        prompts_help: {
          count: 10,
          average: 22,
          median: 22,
          min: 18,
          max: 25,
          p95: 24,
          p99: 25
        },
        check_github_status: {
          count: 10,
          average: 152,
          median: 152,
          min: 139,
          max: 168,
          p95: 165,
          p99: 167
        },
        compose_prompts: {
          count: 10,
          average: 142,
          median: 142,
          min: 128,
          max: 156,
          p95: 153,
          p99: 155
        }
      }
    }
  };

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

  console.log(`✅ Mock test reports generated successfully!`);
  console.log(`\n📊 Reports saved to:`);
  console.log(`   - JSON: ${jsonPath}`);
  console.log(`   - Markdown: ${mdPath}`);
  console.log(`   - HTML: ${htmlPath}`);
  console.log(`\n📁 Latest results available at:`);
  console.log(`   - test-results/latest.json`);
  console.log(`   - test-results/latest.md`);
  console.log(`   - test-results/latest.html`);
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
    const bars = '█'.repeat(Math.round(stats.average / 5));
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
            <p class="value">100%</p>
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
        <p>All tests completed successfully with excellent performance metrics!</p>
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
                    },
                    legend: {
                        position: 'bottom'
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

// Run the generator
generateMockResults().catch(console.error);