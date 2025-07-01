# Smart Prompts MCP Server

[![Tests](https://img.shields.io/badge/tests-100%25%20passing-brightgreen)](test-results/latest.html)
[![Coverage](https://img.shields.io/badge/coverage-84%25-green)](test-results/latest.html)
[![Performance](https://img.shields.io/badge/avg%20response-<200ms-brightgreen)](test-results/benchmarks/)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-blue)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

An enhanced MCP (Model Context Protocol) server that fetches prompts from GitHub repositories with intelligent discovery, composition, and management features. This is an enhanced fork of [prompts-mcp-server](https://github.com/tanker327/prompts-mcp-server) with GitHub integration and advanced features.

## 🌟 Key Features

### Core Capabilities
- **🔄 GitHub Integration**: Fetch prompts directly from GitHub repositories (public/private)
- **🔍 Smart Discovery**: Advanced search with category and tag filtering
- **🔗 Prompt Composition**: Combine multiple prompts into workflows
- **📊 Usage Tracking**: Analytics on prompt usage patterns
- **⚡ Real-time Updates**: Automatic synchronization with GitHub
- **🤖 AI Guidance**: Enhanced tool descriptions and workflow recommendations

### MCP Protocol Support
- **Tools**: 7 specialized tools for prompt management
- **Resources**: 13+ resource endpoints for browsing and discovery
- **Prompts**: Dynamic templates with Handlebars support

## 📋 Prerequisites

Before installation, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- Git installed and configured
- GitHub account (for GitHub integration)
- GitHub Personal Access Token (for private repos or to avoid rate limits)

## 🚀 Installation

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/jezweb/smart-prompts-mcp.git
cd smart-prompts-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Verify installation
./verify-install.sh
```

### Step 2: Configure Environment

Create a `.env` file in the project root:

```bash
# Required: GitHub Configuration
GITHUB_OWNER=your-username          # Your GitHub username or org
GITHUB_REPO=your-prompts-repo      # Repository containing prompts
GITHUB_BRANCH=main                  # Branch to use (default: main)
GITHUB_PATH=                        # Subdirectory path (optional)
GITHUB_TOKEN=ghp_xxxxx             # Personal access token (recommended)

# Optional: Cache Configuration
CACHE_TTL=300000                    # Cache time-to-live in ms (default: 5 min)
CACHE_REFRESH_INTERVAL=60000        # Auto-refresh interval in ms (default: 1 min)

# Optional: Feature Flags
ENABLE_SEMANTIC_SEARCH=true         # Advanced search features
ENABLE_PROMPT_COMPOSITION=true      # Prompt combination features
ENABLE_USAGE_TRACKING=true          # Track prompt usage
```

### Step 3: MCP Client Configuration

#### For Claude Desktop (macOS)
Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "smart-prompts": {
      "command": "node",
      "args": ["/absolute/path/to/smart-prompts-mcp/dist/index.js"],
      "env": {
        "GITHUB_OWNER": "your-username",
        "GITHUB_REPO": "your-prompts-repo",
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

#### For Roo Cline (VS Code)
Add to Roo Cline MCP settings:

```json
"smart-prompts": {
  "command": "node",
  "args": ["/absolute/path/to/smart-prompts-mcp/dist/index.js"],
  "env": {
    "GITHUB_OWNER": "your-username",
    "GITHUB_REPO": "your-prompts-repo",
    "GITHUB_TOKEN": "ghp_your_token_here"
  }
}
```

## SSE Configuration (using Docker)

This uses mcp-proxy to allow stdio endpoints to be accessed through sse.


#### Build docker image

**NOTE**: GITHUB\_OWNER, GITHUB\_REPO, and GITHUB\_TOKEN variable seem to be ignored from the .env file.

Update them if you want for consistency, but the run.sh file sets environment variables later, which do work properly.
    
```bash
cd docker

# Update your dotenv values - note the NOTE above.
vi dotenv.txt

# Build the image
./build.sh

# modify environment 
# Run the image
# Verify installation
./verify-install.sh
```
#### Modify your run.sh file

```
# Run with environment variables
docker run --rm -d \
  --name smart-prompts-server \
  -p 8080:8080 \
  -e GITHUB_OWNER=<your github name> \
  -e GITHUB_REPO=<your repo name (not the URL)> \
  -e GITHUB_TOKEN=<GITHUB Token>

# Use a read or read-write token as needed.
```

#### Start Docker Image

```bash
cd docker

# Update your dotenv values - note the NOTE above.
vi dotenv.txt

# Build the image
./build.sh

# modify environment 
# Run the image
# Verify installation
./verify-install.sh
```


### Configure using SSE Endpoint

Some example uses of SSE Endpoint configurations. 

For **LMStudio**
Add the following to the MCP Configuration

```bash
{
  "mcpServers": {
    ...
    
    "smart-prompts": {
      "url": "http://<your host>:8080/sse"
    }
    
    ...
  }
}
```

For **Cline** within VSCode

```bash
    "smart-prompts": {
      "url": "http://<your host>:8080/sse",
      "disabled": false,
      "autoApprove": [
        "search_prompts",
        "prompts_help",
        "create_github_prompt",
        "list_prompt_categories",
        "check_github_status"
      ]
    }
}
```



## 📁 Prompt Organization Best Practices

### Recommended Folder Structure

```
your-prompts-repo/
├── README.md                    # Repository overview
├── ai-prompts/                  # AI and meta-prompts
│   ├── meta-prompt-builder.md
│   └── prompt-engineer.md
├── development/                 # Development prompts
│   ├── backend/
│   │   ├── api-design.md
│   │   └── database-schema.md
│   ├── frontend/
│   │   ├── react-component.md
│   │   └── vue-composition.md
│   └── testing/
│       ├── unit-test-writer.md
│       └── e2e-test-suite.md
├── content-creation/           # Content prompts
│   ├── blog-post-writer.md
│   └── youtube-metadata.md
├── business/                   # Business prompts
│   ├── proposal-generator.md
│   └── email-templates.md
└── INDEX.md                    # Optional: Category index
```

### Naming Conventions

- **Files**: Use kebab-case (e.g., `api-documentation-generator.md`)
- **Prompt Names**: Use snake_case in frontmatter (e.g., `api_documentation_generator`)
- **Categories**: Use lowercase with hyphens (e.g., `content-creation`)
- **Keep names descriptive** but concise

## 📝 Prompt File Format

```yaml
---
name: api_documentation_generator
title: REST API Documentation Generator
description: Generate comprehensive API documentation with examples
category: documentation
tags: [api, rest, documentation, openapi, swagger]
difficulty: intermediate
author: jezweb
version: 1.0
arguments:
  - name: api_spec
    description: The API specification or endpoint details
    required: true
  - name: format
    description: Output format (markdown, openapi, etc)
    required: false
    default: markdown
---

# API Documentation Generator

Generate comprehensive documentation for {{api_spec}} in {{format}} format.

Include:
- Endpoint descriptions
- Request/response examples
- Authentication details
- Error codes
- Rate limiting information
```

## 🛠️ Available Tools

1. **🔍 `search_prompts`** - Always start here! Search by keyword, category, or tags
2. **📋 `list_prompt_categories`** - Browse available categories with counts
3. **📖 `get_prompt`** - Retrieve specific prompt (use exact name from search)
4. **✨ `create_github_prompt`** - Create new prompts in GitHub
5. **🔗 `compose_prompts`** - Combine multiple prompts
6. **❓ `prompts_help`** - Get contextual help and guidance
7. **✅ `check_github_status`** - Verify GitHub connection

### Recommended Workflow

```
1. search_prompts → Find existing prompts
2. get_prompt → View full content
3. compose_prompts → Combine if needed
4. create_github_prompt → Only if nothing exists
```

## 🔧 Troubleshooting

### Common Issues

#### 1. "GitHub access failed" Error
```bash
# Check your token has repo scope
# Verify token in .env file
GITHUB_TOKEN=ghp_your_actual_token

# Test GitHub access
GITHUB_TOKEN=your_token node test-server.js
```

#### 2. "Rate limit exceeded" Error
- Add a GitHub token to increase rate limits
- Reduce cache refresh interval
- Use `CACHE_TTL` to cache longer

#### 3. "No prompts found"
- Check repository structure matches expected format
- Verify GITHUB_PATH if using subdirectory
- Ensure .md files have YAML frontmatter

#### 4. MCP Client Not Connecting
- Use absolute paths in configuration
- Check Node.js is in PATH
- Verify all environment variables
- Check logs: `tail -f ~/.claude/logs/mcp.log`

#### 5. Slow Performance
- Increase `CACHE_TTL` for less frequent updates
- Reduce repository size (archive old prompts)
- Use categories to limit search scope

## 📈 Scaling Considerations

### Current Limitations

1. **GitHub API Rate Limits**
   - 60 requests/hour (unauthenticated)
   - 5,000 requests/hour (authenticated)
   - Each directory fetch = 1 request

2. **Search Limitations**
   - No native semantic search in GitHub
   - Linear search through all files
   - Performance degrades with 100+ prompts

### Scaling Strategies

#### For 50-200 Prompts
- ✅ Current implementation works well
- Use categories and tags for organization
- Implement local caching
- Add GitHub token for higher rate limits

#### For 200-1000 Prompts
- 🔄 **Implement Index File** 
  ```yaml
  # INDEX.md in repo root
  prompts:
    - name: api_generator
      path: development/api-generator.md
      category: development
      tags: [api, codegen]
  ```
- 📊 **Add Search Index**
  - Generate search index on build
  - Store in `search-index.json`
  - Update via GitHub Actions

#### For 1000+ Prompts
- 🗄️ **Database Layer**
  - SQLite for local caching
  - Full-text search capabilities
  - Sync with GitHub periodically
- 🔍 **Elasticsearch/Algolia Integration**
  - Proper search infrastructure
  - Faceted search
  - Relevance ranking

### Future Scaling Features (Roadmap)

1. **Search Index Generation**
   - GitHub Action to build index
   - Download single index file
   - Local semantic search

2. **Lazy Loading**
   - Fetch categories on demand
   - Progressive enhancement
   - Virtual scrolling for large lists

3. **CDN Support**
   - Cache prompts at edge
   - Reduce GitHub API calls
   - Faster global access

## 🚀 Future MCP Server Ideas

Building on the GitHub integration pattern, here are potential MCP servers:

### 1. **Code Snippets MCP Server** 
Store and manage reusable code snippets in GitHub
- Language-specific organization
- Syntax highlighting
- Dependency management
- Version history

### 2. **Documentation Templates MCP** 
GitHub-based documentation template library
- README generators
- API documentation templates
- Project documentation
- Auto-generated from code

### 3. **AI Personas MCP Server**
Manage AI personality configurations
- Expertise definitions
- Communication styles
- Behavioral traits
- Team sharing

### 4. **Project Scaffolding MCP**
Full project template management
- Technology stacks
- Boilerplate code
- Best practices
- Configuration presets

### 5. **Learning Resources MCP**
Curated educational content
- Tutorials and guides
- Code examples
- Progress tracking
- Skill-based recommendations

### 6. **Configuration Manager MCP**
Version-controlled app configs
- Environment management
- Secret handling
- Team synchronization
- Rollback support

### 7. **Workflow Automation MCP**
GitHub Actions integration
- Workflow templates
- CI/CD pipelines
- Automation scripts
- Cross-repo orchestration

### 8. **Knowledge Base MCP**
Team knowledge management
- Q&A pairs
- Troubleshooting guides
- Best practices
- Searchable wiki

## 🧪 Testing

The server includes comprehensive testing to ensure reliability and performance.

### Test Suite Features

- **100% test coverage** of critical functionality
- **Performance benchmarks** with detailed metrics
- **Visual test reports** with interactive charts
- **Automated CI/CD** via GitHub Actions

### Running Tests

```bash
# Run full test suite
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run performance benchmark
npm run test:perf

# Verify installation
npm run test:verify
```

### Test Reports

Test results are automatically generated in multiple formats:
- **JSON**: Detailed results for analysis (`test-results/latest.json`)
- **Markdown**: Human-readable reports (`test-results/latest.md`)
- **HTML**: Interactive visual reports (`test-results/latest.html`)

View the latest test results:
- [Test Report (HTML)](test-results/latest.html)
- [Coverage Report](coverage/index.html)
- [Performance Benchmarks](test-results/benchmarks/)

## 🧪 Development

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Priority Areas

1. **Search Improvements**
   - Implement fuzzy search
   - Add search result ranking
   - Support for regex patterns

2. **Performance Optimization**
   - Implement connection pooling
   - Add request batching
   - Optimize cache strategies

3. **UI/Visualization**
   - Web interface for browsing
   - Prompt preview tool
   - Usage analytics dashboard

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original [prompts-mcp-server](https://github.com/tanker327/prompts-mcp-server) by @tanker327
- [Model Context Protocol](https://modelcontextprotocol.io/) by Anthropic
- Built with inspiration from the MCP community

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/jezweb/smart-prompts-mcp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/jezweb/smart-prompts-mcp/discussions)
- **Examples**: [jezweb/prompts](https://github.com/jezweb/prompts)

---

<p align="center">Made with ❤️ for the MCP community</p>