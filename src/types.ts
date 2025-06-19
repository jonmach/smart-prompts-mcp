/**
 * Type definitions for the smart prompts MCP server
 */

export interface PromptMetadata {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  author?: string;
  version?: string;
  created?: string;
  updated?: string;
  arguments?: PromptArgument[];
  [key: string]: unknown;
}

export interface PromptArgument {
  name: string;
  description?: string;
  required?: boolean;
  default?: any;
}

export interface PromptInfo {
  name: string;
  metadata: PromptMetadata;
  content?: string;
  preview?: string;
}

export interface ToolArguments {
  name?: string;
  filename?: string;
  content?: string;
  query?: string;
  category?: string;
  prompts?: string[];
  values?: Record<string, any>;
  // Fields for create_structured_prompt
  title?: string;
  description?: string;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  author?: string;
}

export interface ServerConfig {
  name: string;
  version: string;
  promptsDir?: string;
}

// MCP Resource types
export interface ResourceInfo {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

// MCP Prompt types
export interface MCPPrompt {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}

// Usage tracking
export interface UsageStats {
  promptId: string;
  count: number;
  lastUsed: string;
  ratings?: number[];
}