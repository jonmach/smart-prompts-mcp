# Smart Prompts MCP Server

An enhanced MCP (Model Context Protocol) server that fetches prompts from GitHub repositories with intelligent discovery, composition, and management features.

## Features

### 🚀 Core Features
- **GitHub Integration**: Fetch prompts directly from GitHub repositories (no local storage required)
- **Smart Discovery**: Search prompts using keywords with intelligent matching
- **Prompt Composition**: Combine multiple prompts dynamically
- **Usage Tracking**: Track which prompts are used most frequently
- **Real-time Updates**: Automatic cache refresh from GitHub

### 🔧 MCP Protocol Support
- **Tools**: Search, compose, and manage prompts
- **Resources**: Browse prompts by category, tags, or usage
- **Prompts**: Interactive templates with dynamic arguments

### 💡 Enhanced Capabilities
- YAML frontmatter support for rich metadata
- Handlebars templating for dynamic content
- Category and tag-based organization
- Usage statistics and analytics
- Backward compatibility with local file storage

## Installation

```bash
# Clone the repository
git clone https://github.com/jezweb/smart-prompts-mcp.git
cd smart-prompts-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

## Configuration

### Environment Variables

```bash
# GitHub Configuration
GITHUB_OWNER=jezweb              # GitHub username or organization
GITHUB_REPO=prompts              # Repository name
GITHUB_BRANCH=main               # Branch to fetch from
GITHUB_PATH=                     # Path within repo (optional)
GITHUB_TOKEN=                    # Personal access token (for private repos)

# Cache Configuration
CACHE_TTL=300000                 # Cache time-to-live (5 minutes)
CACHE_REFRESH_INTERVAL=60000     # Refresh interval (1 minute)

# Feature Flags
ENABLE_SEMANTIC_SEARCH=true      # Enable semantic search
ENABLE_PROMPT_COMPOSITION=true   # Enable prompt composition
ENABLE_USAGE_TRACKING=true       # Enable usage tracking
```

### MCP Configuration

Add to your MCP settings:

```json
{
  "mcpServers": {
    "smart-prompts": {
      "command": "node",
      "args": ["/path/to/smart-prompts-mcp/dist/index.js"],
      "env": {
        "GITHUB_OWNER": "your-username",
        "GITHUB_REPO": "your-prompts-repo"
      }
    }
  }
}
```

## Prompt File Format

Prompts use markdown files with YAML frontmatter:

```yaml
---
name: prompt_name
title: Human Readable Title
description: Brief description of the prompt
category: coding
tags: [javascript, react, best-practices]
difficulty: intermediate
arguments:
  - name: framework
    description: The framework to use
    required: true
  - name: style
    description: Coding style preference
    required: false
    default: functional
---

# Prompt Content

Your prompt template here with {{framework}} and {{style}} variables.
```

## Usage

### Tools

```typescript
// Search for prompts
search_prompts({ query: "react" })

// Compose multiple prompts
compose_prompts({ 
  prompts: ["code_review", "api_design"],
  separator: "\n\n---\n\n"
})

// Get usage statistics
get_prompt_stats()

// Standard prompts-mcp-server tools
add_prompt({ name: "test", content: "..." })
get_prompt({ name: "test" })
list_prompts()
delete_prompt({ name: "test" })
```

### Resources

Access prompt data through MCP resources:

- `prompts://list` - All available prompts
- `prompts://categories` - List of categories
- `prompts://tags` - All tags
- `prompts://stats` - Usage statistics
- `prompts://recent` - Recently used prompts
- `prompts://category/{name}` - Prompts by category
- `prompts://search?q={query}` - Search results

### Prompts

Interactive prompt templates:

- Repository prompts with dynamic arguments
- `compose_prompt` - Combine multiple prompts
- `search_prompts` - Interactive search
- `suggest_prompts` - AI-powered suggestions

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build
```

## Contributing

We welcome contributions! This is a fork of the excellent [prompts-mcp-server](https://github.com/tanker327/prompts-mcp-server) with added features.

### Areas for Contribution

1. **Semantic Search**: Implement embeddings-based search
2. **Web UI**: Create a simple web interface for browsing
3. **More Templates**: Add support for more template engines
4. **Analytics**: Enhanced usage analytics and insights
5. **Sync Features**: Two-way sync with GitHub

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## Example Prompts Repository

See [github.com/jezweb/prompts](https://github.com/jezweb/prompts) for example prompt structures.

## Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│  GitHub Repo    │────▶│ Smart Prompts│────▶│ MCP Client  │
│  (Prompts)      │◀────│   MCP Server │◀────│ (Claude,etc)│
└─────────────────┘     └──────────────┘     └─────────────┘
        │                      │                     │
        │                      ▼                     │
        │               ┌──────────────┐            │
        │               │    Cache     │            │
        │               │  (In-Memory) │            │
        │               └──────────────┘            │
        │                      │                     │
        └──────────────────────┴─────────────────────┘
                         Resources
                         Prompts
                         Tools
```

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Original [prompts-mcp-server](https://github.com/tanker327/prompts-mcp-server) by tanker327
- [Model Context Protocol](https://modelcontextprotocol.io/) by Anthropic
- Inspired by [quick-data-mcp](https://github.com/disler/quick-data-mcp)

## Support

- Issues: [GitHub Issues](https://github.com/jezweb/smart-prompts-mcp/issues)
- Discussions: [GitHub Discussions](https://github.com/jezweb/smart-prompts-mcp/discussions)