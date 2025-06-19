# 📈 Scaling Guide for Smart Prompts MCP Server

## 🎯 Overview

As your prompt library grows, you'll need strategies to maintain performance and usability. This guide provides practical approaches for different scales.

## 📊 Scale Tiers

### Tier 1: Small (1-50 prompts)
- ✅ **Current implementation works perfectly**
- No modifications needed
- Sub-second response times
- Minimal GitHub API usage

### Tier 2: Medium (50-200 prompts)
- ✅ **Current implementation works well**
- Add GitHub token for rate limits
- Organize with categories
- Consider longer cache TTL

### Tier 3: Large (200-1000 prompts)
- ⚠️ **Performance considerations**
- Implement index file strategy
- Add search optimization
- Consider database caching

### Tier 4: Enterprise (1000+ prompts)
- 🔴 **Requires architectural changes**
- Database layer essential
- Search infrastructure needed
- CDN/edge caching recommended

## 🔧 Implementation Strategies

### 1. Index File Approach (200-1000 prompts)

Create `PROMPTS_INDEX.json` in your repository root:

```json
{
  "version": "1.0",
  "updated": "2024-01-20T10:00:00Z",
  "prompt_count": 245,
  "categories": {
    "development": 89,
    "documentation": 45,
    "business": 34,
    "content-creation": 77
  },
  "prompts": [
    {
      "name": "api_documentation_generator",
      "path": "documentation/api-documentation-generator.md",
      "title": "API Documentation Generator",
      "category": "documentation",
      "tags": ["api", "docs", "rest"],
      "description": "Generate comprehensive API documentation",
      "last_modified": "2024-01-19T15:30:00Z"
    }
  ]
}
```

#### Benefits
- Single API call to fetch all metadata
- Local searching without hitting GitHub
- Faster category/tag filtering
- Reduced rate limit usage

#### Implementation

```typescript
// Enhanced GitHub fetcher with index support
class IndexedGitHubPromptFetcher extends EnhancedGitHubPromptFetcher {
  async fetchAllPrompts(): Promise<PromptInfo[]> {
    // Try to fetch index first
    try {
      const index = await this.fetchIndex();
      if (index && this.isIndexFresh(index)) {
        return this.loadPromptsFromIndex(index);
      }
    } catch (error) {
      console.warn('Index not available, falling back to recursive fetch');
    }
    
    // Fall back to recursive fetch
    return super.fetchAllPrompts();
  }
  
  private async fetchIndex(): Promise<PromptsIndex> {
    const { data } = await this.octokit.repos.getContent({
      owner: this.config.owner,
      repo: this.config.repo,
      path: 'PROMPTS_INDEX.json'
    });
    
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return JSON.parse(content);
  }
}
```

### 2. GitHub Actions Index Builder

Automate index generation with GitHub Actions:

```yaml
# .github/workflows/build-index.yml
name: Build Prompts Index

on:
  push:
    paths:
      - '**/*.md'
      - '!README.md'
      - '!PROMPTS_INDEX.json'

jobs:
  build-index:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Build Index
        run: |
          npx ts-node scripts/build-index.ts
      
      - name: Commit Index
        run: |
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add PROMPTS_INDEX.json
          git commit -m "Update prompts index"
          git push
```

### 3. Search Optimization Strategies

#### A. Local Search Index

```typescript
// Create search index with lunr.js or flexsearch
import { Index } from 'flexsearch';

class SearchablePromptCache extends EnhancedPromptCache {
  private searchIndex: Index;
  
  async initialize() {
    await super.initialize();
    this.buildSearchIndex();
  }
  
  private buildSearchIndex() {
    this.searchIndex = new Index({
      tokenize: 'forward',
      cache: true,
      resolution: 9
    });
    
    for (const [id, prompt] of this.prompts) {
      this.searchIndex.add(id, [
        prompt.metadata.title,
        prompt.metadata.description,
        prompt.metadata.tags?.join(' '),
        prompt.content
      ].join(' '));
    }
  }
  
  searchPrompts(query: string): PromptInfo[] {
    const results = this.searchIndex.search(query);
    return results.map(id => this.prompts.get(id)).filter(Boolean);
  }
}
```

#### B. Category-Based Lazy Loading

```typescript
class LazyPromptCache extends EnhancedPromptCache {
  private loadedCategories = new Set<string>();
  
  async getPromptsByCategory(category: string): Promise<PromptInfo[]> {
    if (!this.loadedCategories.has(category)) {
      await this.loadCategory(category);
    }
    return super.getPromptsByCategory(category);
  }
  
  private async loadCategory(category: string) {
    const prompts = await this.fetcher.fetchCategory(category);
    for (const prompt of prompts) {
      this.prompts.set(prompt.name, prompt);
    }
    this.loadedCategories.add(category);
  }
}
```

### 4. Database Layer (1000+ prompts)

#### SQLite Implementation

```typescript
import Database from 'better-sqlite3';

class DatabasePromptCache {
  private db: Database.Database;
  
  constructor() {
    this.db = new Database('prompts.db');
    this.initializeSchema();
  }
  
  private initializeSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS prompts (
        name TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        content TEXT NOT NULL,
        tags TEXT,
        metadata TEXT,
        last_updated INTEGER,
        usage_count INTEGER DEFAULT 0
      );
      
      CREATE INDEX IF NOT EXISTS idx_category ON prompts(category);
      CREATE INDEX IF NOT EXISTS idx_tags ON prompts(tags);
      CREATE VIRTUAL TABLE IF NOT EXISTS prompts_fts USING fts5(
        name, title, description, content, tags
      );
    `);
  }
  
  searchPrompts(query: string): PromptInfo[] {
    const stmt = this.db.prepare(`
      SELECT p.*, 
             rank
      FROM prompts p
      JOIN prompts_fts ON p.name = prompts_fts.name
      WHERE prompts_fts MATCH ?
      ORDER BY rank
      LIMIT 50
    `);
    
    return stmt.all(query).map(this.rowToPrompt);
  }
}
```

### 5. Folder Organization Best Practices

#### For Large Libraries

```
prompts-repo/
├── INDEX.md                     # Human-readable index
├── PROMPTS_INDEX.json          # Machine-readable index
├── _archive/                   # Old/deprecated prompts
├── _templates/                 # Prompt templates
├── categories/
│   ├── development/
│   │   ├── _index.md          # Category overview
│   │   ├── backend/
│   │   │   ├── _index.md     # Subcategory overview
│   │   │   ├── api/          # Further organization
│   │   │   └── database/
│   │   └── frontend/
│   └── documentation/
└── scripts/
    ├── build-index.ts         # Index builder
    ├── validate-prompts.ts    # Quality checks
    └── migrate-prompts.ts     # Migration tools
```

#### Naming Conventions for Scale

1. **Hierarchical Naming**
   ```
   category_subcategory_specific_name.md
   dev_backend_api_rest_generator.md
   ```

2. **Prefixed IDs**
   ```
   D001_api_generator.md      # Development
   B001_proposal_writer.md    # Business
   C001_blog_writer.md        # Content
   ```

3. **Version Suffix**
   ```
   api_generator_v2.md
   api_generator_2024.md
   ```

## 🚀 Migration Path

### From Current to Indexed (200+ prompts)

1. **Generate Initial Index**
   ```bash
   npm run scripts:build-index
   ```

2. **Update Fetcher**
   ```typescript
   // In config
   USE_INDEX_FILE=true
   ```

3. **Test Performance**
   ```bash
   npm run benchmark
   ```

4. **Set Up Automation**
   - Add GitHub Action
   - Configure webhooks
   - Monitor performance

### From Indexed to Database (1000+ prompts)

1. **Export to SQLite**
   ```bash
   npm run scripts:migrate-to-db
   ```

2. **Update Cache Layer**
   - Switch to DatabasePromptCache
   - Maintain GitHub sync

3. **Add Search Infrastructure**
   - Implement full-text search
   - Add relevance ranking

## 📊 Performance Benchmarks

| Prompts | Current | Indexed | Database |
|---------|---------|---------|----------|
| 50      | 0.2s    | 0.1s    | 0.1s     |
| 200     | 1.5s    | 0.3s    | 0.2s     |
| 500     | 4.5s    | 0.5s    | 0.3s     |
| 1000    | 10s     | 0.8s    | 0.4s     |
| 5000    | 45s     | 2s      | 0.6s     |

## 🔍 Search Architecture Options

### 1. **Client-Side Search** (Current)
- ✅ Simple implementation
- ✅ No infrastructure needed
- ❌ Limited to exact/substring matching
- ❌ Performance degrades with scale

### 2. **Indexed Search** (200-1000)
- ✅ Much faster than recursive fetch
- ✅ Still uses GitHub as source
- ✅ Supports better search algorithms
- ❌ Index must be kept updated

### 3. **Database Search** (1000+)
- ✅ Millisecond response times
- ✅ Full-text search capabilities
- ✅ Complex queries possible
- ❌ Requires sync mechanism

### 4. **Search Service** (Enterprise)
- ✅ Best search experience
- ✅ Semantic search possible
- ✅ Faceted search/filtering
- ❌ Additional infrastructure

## 🎯 Recommendations by Use Case

### Personal Use (1-200 prompts)
- Use current implementation
- Add GitHub token
- Organize with categories

### Team Use (200-1000 prompts)
- Implement index file
- Add search optimization
- Consider access controls

### Enterprise Use (1000+ prompts)
- Database layer required
- Search infrastructure
- CDN for global teams
- Analytics and monitoring

## 📚 Additional Resources

- [GitHub API Best Practices](https://docs.github.com/en/rest/guides/best-practices-for-integrators)
- [SQLite Full-Text Search](https://www.sqlite.org/fts5.html)
- [FlexSearch Documentation](https://github.com/nextapps-de/flexsearch)
- [Algolia MCP Integration Guide](https://algolia.com/doc)

---

Remember: Start simple and scale when needed. The current implementation handles most use cases well!