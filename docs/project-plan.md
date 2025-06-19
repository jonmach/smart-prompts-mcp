# Smart Prompts MCP Server - Project Plan

## Overview
An enhanced MCP server that fetches prompts from GitHub repositories and provides intelligent prompt discovery, composition, and management features.

## Architecture

### Core Components

1. **GitHub Integration**
   - Fetch prompts directly from GitHub repositories (public/private)
   - No local storage required
   - Watch for updates and cache with periodic refresh

2. **MCP Protocol Implementation**
   - **Resources** (Application-controlled context)
   - **Prompts** (User-controlled templates)
   - **Tools** (Model-controlled actions)

### MCP Resources
- `prompts://list` - List all available prompts
- `prompts://category/{name}` - Get prompts by category
- `prompts://search?q={query}` - Search prompts
- `prompts://stats` - Usage statistics
- `prompts://recent` - Recently used prompts

### MCP Prompts
Dynamic prompt templates with:
- Arguments support (required/optional)
- Context-aware suggestions
- Multi-step workflows
- Prompt composition capabilities

### MCP Tools
- `fetch_prompt` - Get specific prompt from GitHub
- `search_prompts` - Semantic search across prompts
- `compose_prompt` - Combine multiple prompts
- `suggest_prompts` - AI-powered suggestions

## Prompt File Structure

```yaml
---
name: code_review_checklist
category: coding
tags: [review, quality, best-practices]
description: Comprehensive code review template
arguments:
  - name: language
    required: true
    description: Programming language
  - name: focus_areas
    required: false
    description: Specific areas to focus on
---

# Code Review Checklist for {{language}}

## General Guidelines
- [ ] Code follows project style guidelines
- [ ] Functions and variables have descriptive names
- [ ] Complex logic is well-commented

{{#if focus_areas}}
## Focus Areas: {{focus_areas}}
{{/if}}

[Additional prompt content...]
```

## Enhanced Features

1. **Smart Discovery**
   - Semantic search using embeddings
   - Context-aware suggestions based on current task
   - Related prompt recommendations

2. **Dynamic Composition**
   - Combine multiple prompts
   - Fill templates with context
   - Chain prompts for workflows

3. **Usage Intelligence**
   - Track most used prompts
   - Suggest improvements
   - Learn from usage patterns

4. **GitHub Integration**
   - Fetch directly from repo (no local storage)
   - Watch for updates
   - Support private repos with auth

## Implementation Example

```typescript
// Server structure
{
  resources: {
    // Expose prompt data
    "prompts://list": getAllPrompts(),
    "prompts://category/coding": getPromptsByCategory("coding"),
    "prompts://prompt/{id}": getPromptById(id)
  },
  
  prompts: {
    // Interactive prompt templates
    "enhance_code": {
      description: "Enhance code with best practices",
      arguments: [
        { name: "language", required: true },
        { name: "framework", required: false }
      ]
    },
    "generate_tests": {
      description: "Generate test cases",
      arguments: [
        { name: "test_framework", required: true }
      ]
    }
  },
  
  tools: {
    // Actions the AI can take
    "search_prompts": searchWithEmbeddings,
    "compose_prompt": combinePrompts,
    "analyze_context": suggestRelevantPrompts
  }
}
```

## Benefits
- No local file management required
- Rich MCP protocol features (resources, prompts, tools)
- Intelligent prompt discovery and composition
- Better integration with AI assistants
- Community contribution potential
- Version control through GitHub
- Easy sharing and collaboration