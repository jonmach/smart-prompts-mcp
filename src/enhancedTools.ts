/**
 * Enhanced MCP tools with better descriptions and GitHub integration
 */

import {
  ListToolsResult,
  CallToolResult,
  CallToolRequest,
  TextContent,
} from '@modelcontextprotocol/sdk/types.js';
import { GitHubPromptOperations } from './githubOperations.js';
import { EnhancedPromptCache } from './enhancedCache.js';
import { GitHubConfig } from './config.js';

interface EnhancedToolArguments {
  // Search and list
  query?: string;
  category?: string;
  tags?: string[];
  
  // Prompt operations
  name?: string;
  title?: string;
  description?: string;
  content?: string;
  filename?: string;
  author?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  arguments?: Array<{
    name: string;
    description: string;
    required?: boolean;
  }>;
  
  // GitHub operations
  commitMessage?: string;
  storage?: 'github' | 'local';
  
  // Compose operations
  prompts?: string[];
  separator?: string;
  
  // Help operations
  topic?: string;
}

export class EnhancedPromptTools {
  private githubOps: GitHubPromptOperations;
  private cache: EnhancedPromptCache;
  private hasGitHubAccess: boolean = false;

  constructor(githubConfig: GitHubConfig, cache: EnhancedPromptCache) {
    this.githubOps = new GitHubPromptOperations(githubConfig);
    this.cache = cache;
    
    // Check GitHub access on initialization
    this.checkGitHubAccess();
  }

  private async checkGitHubAccess() {
    this.hasGitHubAccess = await this.githubOps.hasWriteAccess();
    if (!this.hasGitHubAccess) {
      console.error('No GitHub write access. GitHub operations will be disabled.');
    }
  }

  /**
   * Get enhanced tool definitions with better descriptions
   */
  getToolDefinitions(): ListToolsResult {
    return {
      tools: [
        // Help and guidance tool
        {
          name: 'prompts_help',
          description: 'Get help understanding how to use the Smart Prompts tools effectively. Returns guidance on tool usage, examples, and best practices.',
          inputSchema: {
            type: 'object',
            properties: {
              topic: {
                type: 'string',
                description: 'Specific topic to get help on (e.g., "creating", "searching", "github", "examples"). Leave empty for general help.',
              },
            },
          },
        },
        
        // Search and discovery tools
        {
          name: 'search_prompts',
          description: '🔍 ALWAYS START HERE: Search for prompts by keyword, category, or tags. Returns matching prompts with their metadata. This is the recommended first step before using get_prompt or creating new prompts. Helps avoid duplicates and find exactly what you need.',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search keywords to find in prompt title, description, or content. Examples: "api", "documentation", "code review", "testing"',
              },
              category: {
                type: 'string',
                description: 'Filter by specific category. Available: "development", "content-creation", "business", "ai-prompts", "devops", "documentation", "project-management"',
              },
              tags: {
                type: 'array',
                items: { type: 'string' },
                description: 'Filter by tags for precise matching. Examples: ["api", "rest"], ["testing", "automation"], ["documentation", "technical-writing"]',
              },
            },
            examples: [
              { query: "api documentation", description: "Find prompts about API documentation" },
              { category: "development", description: "See all development-related prompts" },
              { query: "test", tags: ["automation"], description: "Find testing automation prompts" }
            ],
          },
        },
        
        {
          name: 'list_prompt_categories',
          description: '📋 Overview: List all available prompt categories with prompt counts. Use this to explore the library structure and see what categories exist before searching or creating prompts. Great for discovering new areas.',
          inputSchema: {
            type: 'object',
            properties: {},
            description: 'No parameters needed. Returns all categories with prompt counts for easy browsing.',
          },
        },
        
        // Read operations
        {
          name: 'get_prompt',
          description: '📖 Get Full Prompt: Retrieve a specific prompt by its exact name. ⚠️ IMPORTANT: Use search_prompts first to find the correct prompt name, then use this tool. Returns the complete prompt content with metadata and template variables.',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Exact prompt name from search results. Must match exactly (e.g., "api_documentation_generator", "REST API Endpoint Generator"). Copy the name field from search_prompts results.',
              },
            },
            required: ['name'],
            examples: [
              { name: "software_project_build_plan_generator", description: "Get the build plan generator prompt" },
              { name: "youtube_metadata_generator", description: "Get the YouTube metadata prompt" }
            ],
          },
        },
        
        // Create operations
        {
          name: 'create_github_prompt',
          description: '✨ Create New Prompt: Create a new prompt and save it directly to the GitHub repository. 🎯 WORKFLOW: Always use search_prompts first to check if a similar prompt already exists. Only create new prompts when needed to avoid duplicates.',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Unique identifier for the prompt. Use lowercase with underscores. Examples: "code_review_assistant", "api_documentation_generator", "database_design_helper"',
              },
              title: {
                type: 'string',
                description: 'Human-readable title that clearly explains the prompt\'s purpose. Examples: "Code Review Assistant for Pull Requests", "API Documentation Generator", "Database Schema Designer"',
              },
              description: {
                type: 'string',
                description: 'Clear, concise description of what the prompt does and when to use it. Include the main benefits and use cases.',
              },
              category: {
                type: 'string',
                description: 'Choose from existing categories: "development", "content-creation", "business", "ai-prompts", "devops", "documentation", "project-management". Use list_prompt_categories to see all options.',
              },
              content: {
                type: 'string',
                description: 'The actual prompt template content. Use {{variable_name}} for dynamic placeholders. Include clear instructions and examples in the prompt.',
              },
              tags: {
                type: 'array',
                items: { type: 'string' },
                description: '2-5 relevant tags for discoverability. Examples: ["code-review", "github", "quality"], ["api", "documentation", "openapi"], ["database", "sql", "design"]',
              },
              difficulty: {
                type: 'string',
                enum: ['beginner', 'intermediate', 'advanced'],
                description: 'Complexity level of the prompt',
              },
              author: {
                type: 'string',
                description: 'Author name or handle',
              },
              arguments: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      description: 'Argument name (for {{placeholders}})',
                    },
                    description: {
                      type: 'string',
                      description: 'What this argument is for',
                    },
                    required: {
                      type: 'boolean',
                      description: 'Whether this argument is required',
                    },
                  },
                  required: ['name', 'description'],
                },
                description: 'Template arguments for dynamic content',
              },
              commitMessage: {
                type: 'string',
                description: 'Git commit message. Defaults to "Add prompt: [name]"',
              },
            },
            required: ['name', 'title', 'description', 'content'],
          },
        },
        
        // Utility tools
        {
          name: 'compose_prompts',
          description: '🔗 Combine Prompts: Combine multiple existing prompts into a single prompt. Perfect for creating complex multi-step workflows. 📋 WORKFLOW: Use search_prompts to find prompt names first, then compose them.',
          inputSchema: {
            type: 'object',
            properties: {
              prompts: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of exact prompt names to combine in order. Get these names from search_prompts results. Examples: ["code_review_assistant", "documentation_generator"]',
              },
              separator: {
                type: 'string',
                description: 'Text to insert between prompts. Defaults to "\\n\\n---\\n\\n". Can use "\\n\\nNext Step:\\n\\n" or custom separators.',
              },
            },
            required: ['prompts'],
            examples: [
              { prompts: ["code_review_assistant", "documentation_generator"], description: "Review code then generate docs" },
              { prompts: ["api_documentation_generator", "testing_framework"], separator: "\\n\\nNext Task:\\n\\n", description: "Document API then create tests" }
            ],
          },
        },
        
        // GitHub sync operations
        {
          name: 'check_github_status',
          description: 'Check GitHub connection status and write access. Use this to verify GitHub operations are available.',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    };
  }

  /**
   * Handle tool calls
   */
  async handleToolCall(request: CallToolRequest): Promise<CallToolResult> {
    const { name, arguments: args } = request.params;
    const toolArgs = (args || {}) as EnhancedToolArguments;

    try {
      switch (name) {
        case 'prompts_help':
          return this.handleHelp(toolArgs);
        case 'search_prompts':
          return this.handleSearch(toolArgs);
        case 'list_prompt_categories':
          return this.handleListCategories();
        case 'get_prompt':
          return this.handleGetPrompt(toolArgs);
        case 'create_github_prompt':
          return await this.handleCreateGitHubPrompt(toolArgs);
        case 'compose_prompts':
          return this.handleComposePrompts(toolArgs);
        case 'check_github_status':
          return await this.handleCheckGitHubStatus();
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          } as TextContent,
        ],
        isError: true,
      };
    }
  }

  /**
   * Handle help requests
   */
  private handleHelp(args: EnhancedToolArguments): CallToolResult {
    const topic = args.topic?.toLowerCase() || 'general';
    
    const helpTexts: Record<string, string> = {
      general: `# 🚀 Smart Prompts MCP Server Help

This server manages a library of reusable prompt templates stored in GitHub.

## 🎯 **RECOMMENDED WORKFLOW (Follow This Order):**

### 1. 🔍 **ALWAYS START WITH SEARCH**
   → Use **search_prompts** first to find existing prompts
   → Avoid creating duplicates and discover what's available

### 2. 📖 **GET DETAILS WHEN NEEDED** 
   → Use **get_prompt** with exact names from search results
   → See full content and template variables

### 3. ✨ **CREATE ONLY WHEN NECESSARY**
   → Use **create_github_prompt** after confirming nothing similar exists
   → Automatically saves to GitHub with proper organization

### 4. 🔗 **COMBINE FOR COMPLEX TASKS**
   → Use **compose_prompts** to build multi-step workflows
   → Reuse existing prompts in new combinations

## 📚 **Available Tools:**
1. **prompts_help** - Get contextual help and guidance
2. **search_prompts** - 🔍 START HERE - Find existing prompts
3. **list_prompt_categories** - Browse all categories 
4. **get_prompt** - Get full prompt details (use exact names from search)
5. **create_github_prompt** - Create new prompts (search first!)
6. **compose_prompts** - Combine multiple prompts
7. **check_github_status** - Verify GitHub connection

💡 **Pro Tip:** Search before you create! Most tasks already have prompts.

Use 'prompts_help' with topic: "creating", "searching", "workflow", or "examples" for detailed guidance.`,

      workflow: `# 🔄 Recommended Workflow

## ✅ **STEP-BY-STEP PROCESS:**

### **DISCOVERY PHASE** 🔍
1. **Start with search_prompts** 
   - Use keywords related to your task
   - Browse by category if unsure
   - Check multiple search terms

2. **Explore categories with list_prompt_categories**
   - See what's available in each area
   - Get counts to understand library size

### **EVALUATION PHASE** 📖
3. **Use get_prompt for promising results**
   - Get full content and metadata
   - Check template variables and examples
   - Evaluate if it meets your needs

### **ACTION PHASE** ⚡
4a. **If perfect match found:**
   - Use the existing prompt directly
   - Note the template variables needed

4b. **If close match found:**
   - Consider using compose_prompts to combine
   - Extend with additional instructions

4c. **If no match found:**
   - Use create_github_prompt to build new one
   - Follow naming conventions
   - Add good metadata for future discovery

## 🎯 **EXAMPLE WORKFLOW:**

\`\`\`
User needs: "Help with code reviews"

1. search_prompts with query: "code review"
   → Finds: "Code Review Assistant"

2. get_prompt with name: "code_review_assistant" 
   → Perfect! Has template variables for {{code}} and {{focus_areas}}

3. Use the existing prompt ✅
\`\`\`

## ❌ **ANTI-PATTERNS TO AVOID:**
- Creating prompts without searching first
- Using get_prompt with guessed names  
- Ignoring template variables and examples
- Not checking categories for context`,

      creating: `# Creating Prompts

## Best Practices:
1. **Search first** - Check if a similar prompt exists
2. **Use clear names** - lowercase_with_underscores (e.g., api_documentation_generator)
3. **Categorize properly** - Use existing categories when possible
4. **Add good metadata** - Title, description, and tags help discoverability
5. **Include examples** - Show how to use the prompt in the content

## Example:
\`\`\`
create_github_prompt with:
- name: "code_reviewer"
- title: "Automated Code Review Assistant"
- description: "Reviews code for best practices and potential issues"
- category: "development"
- content: "Review the following code for:\\n1. Best practices\\n2. Potential bugs\\n3. Performance issues\\n\\nCode:\\n{{code}}"
- tags: ["code-review", "quality", "development"]
- arguments: [{"name": "code", "description": "The code to review", "required": true}]
\`\`\`

## Template Variables:
Use {{variable_name}} in content for dynamic placeholders.`,

      searching: `# Searching for Prompts

## Search Methods:

### 1. Keyword Search
\`\`\`
search_prompts with:
- query: "api documentation"
\`\`\`
Searches in titles, descriptions, and content.

### 2. Category Filter
\`\`\`
search_prompts with:
- category: "development"
\`\`\`
Shows all prompts in a specific category.

### 3. Tag Filter
\`\`\`
search_prompts with:
- tags: ["api", "rest"]
\`\`\`
Find prompts with specific tags.

### 4. Combined Search
\`\`\`
search_prompts with:
- query: "test"
- category: "development"
- tags: ["automation"]
\`\`\`

## Tips:
- Start broad, then narrow down
- Check list_prompt_categories first
- Use partial keywords (e.g., "doc" finds "documentation")`,

      github: `# GitHub Integration

## How it Works:
1. Prompts are stored in GitHub repository: ${this.hasGitHubAccess ? 'Connected ✓' : 'Read-only (no write access)'}
2. Changes are committed directly to the repository
3. Other users see updates immediately

## Requirements:
- GitHub token with repo access (currently ${this.hasGitHubAccess ? 'configured' : 'missing or read-only'})
- Repository: Check with check_github_status

## Creating Prompts:
- Use create_github_prompt to save directly to GitHub
- Prompts are organized in category folders
- Each prompt is a markdown file with YAML frontmatter

## Troubleshooting:
- Run check_github_status to verify connection
- Ensure GITHUB_TOKEN environment variable is set
- Token needs 'repo' scope for write access`,

      examples: `# Example Prompts

## 1. Simple Prompt
\`\`\`
create_github_prompt with:
- name: "explain_code"
- title: "Code Explanation Generator"
- description: "Explains code in simple terms"
- category: "development"
- content: "Explain this code in simple terms:\\n\\n{{code}}"
- tags: ["explanation", "documentation"]
\`\`\`

## 2. Complex Prompt with Multiple Arguments
\`\`\`
create_github_prompt with:
- name: "api_endpoint_generator"
- title: "REST API Endpoint Generator"
- description: "Creates REST endpoints with documentation"
- category: "development"
- content: "Create a {{method}} endpoint for {{resource}} that {{description}}.\\n\\nInclude:\\n- Validation\\n- Error handling\\n- OpenAPI docs"
- arguments: [
    {"name": "method", "description": "HTTP method", "required": true},
    {"name": "resource", "description": "Resource name", "required": true},
    {"name": "description", "description": "What the endpoint does", "required": true}
  ]
\`\`\`

## 3. Composed Prompt
\`\`\`
compose_prompts with:
- prompts: ["code_reviewer", "documentation_generator"]
- separator: "\\n\\nNext Task:\\n\\n"
\`\`\``,
    };

    const helpText = helpTexts[topic] || helpTexts.general;
    
    return {
      content: [
        {
          type: 'text',
          text: helpText,
        } as TextContent,
      ],
    };
  }

  /**
   * Handle search
   */
  private handleSearch(args: EnhancedToolArguments): CallToolResult {
    let results = this.cache.getAllPrompts();
    
    // Apply filters
    if (args.query) {
      results = this.cache.searchPrompts(args.query);
    }
    
    if (args.category) {
      results = results.filter(p => p.metadata.category === args.category);
    }
    
    if (args.tags && args.tags.length > 0) {
      results = results.filter(p => 
        args.tags!.some(tag => p.metadata.tags?.includes(tag))
      );
    }
    
    if (results.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No prompts found matching your criteria.',
          } as TextContent,
        ],
      };
    }
    
    const text = `# Search Results (${results.length} prompts)\n\n${results.map(p => 
      `## ${p.metadata.title || p.name}\n` +
      `**Name:** ${p.name}\n` +
      `**Category:** ${p.metadata.category || 'uncategorized'}\n` +
      `**Tags:** ${p.metadata.tags?.join(', ') || 'none'}\n` +
      `**Description:** ${p.metadata.description || 'No description'}\n`
    ).join('\n---\n\n')}`;
    
    return {
      content: [
        {
          type: 'text',
          text,
        } as TextContent,
      ],
    };
  }

  /**
   * Handle list categories
   */
  private handleListCategories(): CallToolResult {
    const categories = this.cache.getCategories();
    const categoryCounts: Record<string, number> = {};
    
    // Count prompts per category
    for (const prompt of this.cache.getAllPrompts()) {
      const cat = prompt.metadata.category || 'uncategorized';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }
    
    const text = `# Prompt Categories\n\n${categories.map(cat => 
      `- **${cat}** (${categoryCounts[cat] || 0} prompts)`
    ).join('\n')}\n\nTotal: ${categories.length} categories`;
    
    return {
      content: [
        {
          type: 'text',
          text,
        } as TextContent,
      ],
    };
  }

  /**
   * Handle get prompt
   */
  private handleGetPrompt(args: EnhancedToolArguments): CallToolResult {
    if (!args.name) {
      throw new Error('Prompt name is required. 💡 TIP: Use search_prompts first to find the exact prompt name, then use that name here.');
    }
    
    const prompt = this.cache.getPrompt(args.name);
    if (!prompt) {
      // Suggest similar prompts
      const allPrompts = this.cache.getAllPrompts();
      const searchTerm = args.name.toLowerCase();
      const similarPrompts = allPrompts
        .filter(p => p.name.toLowerCase().includes(searchTerm) || 
                    p.metadata.title?.toLowerCase().includes(searchTerm))
        .slice(0, 3)
        .map(p => `- ${p.name} (${p.metadata.title})`)
        .join('\n');
      
      const suggestion = similarPrompts ? 
        `\n\n💡 Did you mean one of these?\n${similarPrompts}\n\n🔍 Use search_prompts to find the exact name.` :
        '\n\n🔍 Use search_prompts to find available prompt names.';
        
      throw new Error(`Prompt "${args.name}" not found.${suggestion}`);
    }
    
    const text = `# ${prompt.metadata.title || prompt.name}\n\n` +
      `**Name:** ${prompt.name}\n` +
      `**Category:** ${prompt.metadata.category || 'uncategorized'}\n` +
      `**Tags:** ${prompt.metadata.tags?.join(', ') || 'none'}\n` +
      `**Description:** ${prompt.metadata.description || 'No description'}\n` +
      `**Author:** ${prompt.metadata.author || 'Unknown'}\n` +
      `**Difficulty:** ${prompt.metadata.difficulty || 'intermediate'}\n\n` +
      `## Content:\n\n${prompt.content}`;
    
    return {
      content: [
        {
          type: 'text',
          text,
        } as TextContent,
      ],
    };
  }

  /**
   * Handle create GitHub prompt
   */
  private async handleCreateGitHubPrompt(args: EnhancedToolArguments): Promise<CallToolResult> {
    if (!this.hasGitHubAccess) {
      throw new Error('GitHub write access not available. Check your GITHUB_TOKEN.');
    }
    
    if (!args.name || !args.title || !args.description || !args.content) {
      throw new Error('Required fields: name, title, description, content');
    }
    
    // Build metadata
    const metadata = {
      title: args.title,
      description: args.description,
      category: args.category || 'uncategorized',
      tags: args.tags || [],
      difficulty: args.difficulty || 'intermediate',
      author: args.author || 'User',
      version: '1.0',
      created: new Date().toISOString(),
      ...(args.arguments && { arguments: args.arguments }),
    };
    
    // Format content
    const formattedContent = this.githubOps.formatPromptContent(metadata, args.content, args.name);
    
    // Build file path
    const filename = args.filename || args.name.replace(/_/g, '-');
    const path = this.githubOps.buildPromptPath(metadata.category, filename);
    
    // Save to GitHub
    const commitMessage = args.commitMessage || `Add prompt: ${args.name}`;
    const result = await this.githubOps.savePromptToGitHub(path, formattedContent, commitMessage);
    
    // Refresh cache to include new prompt
    await this.cache.refresh();
    
    return {
      content: [
        {
          type: 'text',
          text: `✅ Prompt "${args.name}" created successfully!\n\n` +
            `**File:** ${result.path}\n` +
            `**Category:** ${metadata.category}\n` +
            `**Tags:** ${metadata.tags.join(', ')}\n\n` +
            `The prompt has been saved to GitHub and is now available for use.`,
        } as TextContent,
      ],
    };
  }

  /**
   * Handle compose prompts
   */
  private handleComposePrompts(args: EnhancedToolArguments): CallToolResult {
    if (!args.prompts || args.prompts.length === 0) {
      throw new Error('At least one prompt name is required. 💡 TIP: Use search_prompts to find prompt names, then list them here.');
    }
    
    const separator = args.separator || '\n\n---\n\n';
    const composedParts: string[] = [];
    const notFound: string[] = [];
    
    for (const promptName of args.prompts) {
      const prompt = this.cache.getPrompt(promptName);
      if (prompt && prompt.content) {
        composedParts.push(prompt.content);
      } else {
        notFound.push(promptName);
      }
    }
    
    if (notFound.length > 0) {
      throw new Error(`Prompts not found: ${notFound.join(', ')}\n\n🔍 Use search_prompts to find the correct prompt names. Make sure to use exact names from search results.`);
    }
    
    const composed = composedParts.join(separator);
    
    return {
      content: [
        {
          type: 'text',
          text: `# Composed Prompt\n\nCombined ${args.prompts.length} prompts:\n${args.prompts.map(p => `- ${p}`).join('\n')}\n\n## Result:\n\n${composed}`,
        } as TextContent,
      ],
    };
  }

  /**
   * Handle check GitHub status
   */
  private async handleCheckGitHubStatus(): Promise<CallToolResult> {
    const configValid = await this.githubOps.validateConfig();
    const hasAccess = await this.githubOps.hasWriteAccess();
    
    const text = `# GitHub Status\n\n` +
      `**Configuration Valid:** ${configValid ? '✅ Yes' : '❌ No'}\n` +
      `**Write Access:** ${hasAccess ? '✅ Yes' : '❌ No (read-only)'}\n` +
      `**Repository:** ${configValid ? 'Connected' : 'Not accessible'}\n\n` +
      (hasAccess 
        ? 'You can create and update prompts in GitHub.' 
        : 'You can only read prompts. To enable writing:\n1. Set GITHUB_TOKEN environment variable\n2. Ensure token has "repo" scope\n3. Restart the server');
    
    return {
      content: [
        {
          type: 'text',
          text,
        } as TextContent,
      ],
    };
  }
}