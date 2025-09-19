# Smart Prompts MCP Server Testing Guide

## 🧪 Overview

This directory contains a comprehensive test suite for the Smart Prompts MCP Server. The tests ensure reliability, performance, and proper functionality of all MCP tools.

## 🚀 Quick Start

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Generate performance benchmark
npm run test:perf
```

## 📋 Test Structure

### Test Categories

1. **Core Functionality Tests**
   - Tool listing
   - Help system
   - GitHub status checking

2. **Search and Discovery Tests**
   - Keyword search
   - Category filtering
   - Tag filtering
   - Category listing

3. **Prompt Retrieval Tests**
   - Getting specific prompts
   - Error handling for missing prompts

4. **Prompt Composition Tests**
   - Combining multiple prompts
   - Context injection

5. **Error Handling Tests**
   - Empty queries
   - Invalid parameters
   - Special characters

6. **Performance Tests**
   - Concurrent requests
   - Load testing
   - Response time validation

7. **Integration Tests**
   - Full workflow testing
   - End-to-end scenarios

## 📊 Test Reports

The test suite generates reports in three formats:

### 1. JSON Report
- Detailed test results
- Performance metrics
- Raw data for analysis

### 2. Markdown Report
- Human-readable format
- Performance tables
- ASCII charts

### 3. HTML Report
- Interactive visualizations
- Chart.js graphs
- Responsive design

Reports are saved in the `test-results/` directory with timestamps:
- `test-results-2024-01-20T10-30-00.json`
- `test-results-2024-01-20T10-30-00.md`
- `test-results-2024-01-20T10-30-00.html`

Latest results are always available at:
- `test-results/latest.json`
- `test-results/latest.md`
- `test-results/latest.html`

## 🔧 Configuration

### Environment Variables

```bash
# GitHub Configuration (for testing)
TEST_GITHUB_OWNER=jonmach
TEST_GITHUB_REPO=smart-prompts
GITHUB_TOKEN=your_token_here

# Test Configuration
TEST_TIMEOUT=30000
PERFORMANCE_THRESHOLD=2000
```

### Test Configuration

Edit `test/test-suite.js` to modify:
- Performance thresholds
- Timeout values
- Test data
- Report formats

## 📈 Performance Benchmarks

Performance metrics tracked for each tool:

- **Average response time**
- **Median response time**
- **95th percentile (P95)**
- **99th percentile (P99)**
- **Maximum response time**

### Acceptable Performance Targets

| Tool | Target Avg | Target P95 | Target Max |
|------|------------|------------|------------|
| search_prompts | < 500ms | < 1000ms | < 2000ms |
| get_prompt | < 300ms | < 600ms | < 1000ms |
| list_categories | < 400ms | < 800ms | < 1500ms |
| compose_prompts | < 600ms | < 1200ms | < 2000ms |

## 🐛 Debugging Tests

### Verbose Output

```bash
# Run with verbose logging
npm test -- --reporter=verbose

# Run specific test file
npm test test/test-suite.js

# Run specific test
npm test -- -t "should search prompts by keyword"
```

### Debug Mode

```bash
# Run with Node debugger
node --inspect-brk node_modules/.bin/vitest

# Run with VS Code debugger
# Use the provided launch configuration
```

## 📝 Writing New Tests

### Test Template

```javascript
describe('Feature Category', () => {
  it('should perform specific action', async () => {
    const startTime = Date.now();
    
    // Test implementation
    const result = await client.callTool('tool_name', { 
      param: 'value' 
    });
    
    const duration = Date.now() - startTime;
    
    // Assertions
    expect(result.content).toBeDefined();
    expect(duration).toBeLessThan(PERFORMANCE_THRESHOLD);
    
    // Record results
    recordTest('test_name', true, duration);
    recordPerformance('tool_name', duration);
  });
});
```

### Best Practices

1. **Always measure performance** - Track execution time for all tests
2. **Use descriptive test names** - Clear indication of what's being tested
3. **Test edge cases** - Include error scenarios and boundary conditions
4. **Isolate tests** - Each test should be independent
5. **Clean up resources** - Ensure proper cleanup in afterAll hooks

## 🔄 Continuous Integration

The test suite is integrated with GitHub Actions:

1. **On Push** - Tests run on every push to main/develop
2. **On Pull Request** - Tests required to pass before merge
3. **Scheduled** - Daily performance regression tests
4. **Matrix Testing** - Tests run on Node.js 18.x and 20.x

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

## 🚨 Troubleshooting

### Common Issues

1. **Connection Timeout**
   ```
   Error: Failed to connect to MCP server
   ```
   - Ensure server is built: `npm run build`
   - Check Node.js version: 18+

2. **GitHub Rate Limit**
   ```
   Error: API rate limit exceeded
   ```
   - Add GitHub token to environment
   - Reduce test frequency

3. **Performance Failures**
   ```
   Expected response time < 2000ms, but was 3500ms
   ```
   - Check system resources
   - Verify network connectivity
   - Consider increasing thresholds

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [MCP SDK Documentation](https://modelcontextprotocol.io/)
- [Chart.js Documentation](https://www.chartjs.org/)

## 🤝 Contributing

When adding new features to the MCP server:

1. Write tests first (TDD approach)
2. Ensure all existing tests pass
3. Add performance benchmarks
4. Update test documentation
5. Submit PR with test results

---

For questions or issues, please open a GitHub issue in the repository.
