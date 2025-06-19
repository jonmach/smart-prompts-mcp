// Configuration for Smart Prompts MCP Server

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch?: string;
  path?: string;
  token?: string; // For private repos
}

export interface ServerConfig {
  github: GitHubConfig;
  cache: {
    ttl: number; // Time to live in milliseconds
    refreshInterval: number; // How often to check for updates
  };
  features: {
    semanticSearch: boolean;
    promptComposition: boolean;
    usageTracking: boolean;
  };
}

// Default configuration
export const defaultConfig: ServerConfig = {
  github: {
    owner: process.env.GITHUB_OWNER || 'jezweb',
    repo: process.env.GITHUB_REPO || 'prompts',
    branch: process.env.GITHUB_BRANCH || 'main',
    path: process.env.GITHUB_PATH || '',
    token: process.env.GITHUB_TOKEN,
  },
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutes
    refreshInterval: 60 * 1000, // 1 minute
  },
  features: {
    semanticSearch: true,
    promptComposition: true,
    usageTracking: true,
  },
};

// Load configuration from environment or use defaults
export function loadConfig(): ServerConfig {
  const config = { ...defaultConfig };

  // Override with environment variables if present
  if (process.env.CACHE_TTL) {
    config.cache.ttl = parseInt(process.env.CACHE_TTL, 10);
  }
  if (process.env.CACHE_REFRESH_INTERVAL) {
    config.cache.refreshInterval = parseInt(process.env.CACHE_REFRESH_INTERVAL, 10);
  }

  // Feature flags
  if (process.env.ENABLE_SEMANTIC_SEARCH !== undefined) {
    config.features.semanticSearch = process.env.ENABLE_SEMANTIC_SEARCH === 'true';
  }
  if (process.env.ENABLE_PROMPT_COMPOSITION !== undefined) {
    config.features.promptComposition = process.env.ENABLE_PROMPT_COMPOSITION === 'true';
  }
  if (process.env.ENABLE_USAGE_TRACKING !== undefined) {
    config.features.usageTracking = process.env.ENABLE_USAGE_TRACKING === 'true';
  }

  return config;
}