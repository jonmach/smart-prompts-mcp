# Contributing to Smart Prompts MCP Server

Thank you for your interest in contributing to Smart Prompts MCP Server! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Respect differing viewpoints and experiences

## How to Contribute

### Reporting Issues

1. Check existing issues to avoid duplicates
2. Use issue templates when available
3. Provide clear descriptions and steps to reproduce
4. Include relevant system information

### Suggesting Features

1. Open a discussion first for major features
2. Explain the use case and benefits
3. Consider implementation complexity
4. Be open to feedback and alternatives

### Submitting Pull Requests

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Add tests** for new functionality
5. **Run tests**: `npm test`
6. **Commit with conventional commits**: `feat:`, `fix:`, `docs:`, etc.
7. **Push to your fork**
8. **Open a Pull Request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/smart-prompts-mcp.git
cd smart-prompts-mcp

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests in watch mode
npm run test:watch
```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Testing

- Write tests for all new features
- Maintain or improve code coverage
- Test edge cases and error scenarios
- Use descriptive test names

### Commit Messages

Follow conventional commits:
```
feat: add semantic search capability
fix: handle empty GitHub responses
docs: update installation instructions
test: add tests for prompt composition
refactor: simplify cache logic
```

## Areas for Contribution

### High Priority

1. **Semantic Search Implementation**
   - Add vector embeddings for prompts
   - Implement similarity search
   - Cache embeddings efficiently

2. **Web UI Development**
   - Simple React/Vue interface
   - Browse and search prompts
   - Copy prompt functionality

3. **Template Engine Support**
   - Add Mustache support
   - Support for Liquid templates
   - Template validation

### Medium Priority

4. **Analytics Dashboard**
   - Visualize usage statistics
   - Track popular prompts
   - Export analytics data

5. **Two-way GitHub Sync**
   - Push local changes to GitHub
   - Handle merge conflicts
   - Branch management

6. **Prompt Versioning**
   - Track prompt history
   - Compare versions
   - Rollback capability

### Nice to Have

7. **Prompt Testing Framework**
   - Test prompt outputs
   - Validate arguments
   - Performance testing

8. **Multi-repo Support**
   - Fetch from multiple repos
   - Merge prompt collections
   - Handle duplicates

## Testing Your Changes

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Manual Testing
```bash
# Build and run locally
npm run build
npm start

# Test with MCP Inspector
npx @modelcontextprotocol/inspector node dist/index.js
```

## Documentation

- Update README.md for user-facing changes
- Update CLAUDE.md for development changes
- Add JSDoc comments for new functions
- Include examples in documentation

## Pull Request Checklist

- [ ] Tests pass locally
- [ ] Code follows project style
- [ ] Documentation updated
- [ ] Commit messages follow conventions
- [ ] PR description explains changes
- [ ] No unnecessary files committed

## Questions?

- Open a discussion for general questions
- Tag maintainers for urgent issues
- Join our community chat (if available)

## Recognition

Contributors will be recognized in:
- README.md acknowledgments
- GitHub contributors page
- Release notes

Thank you for contributing to Smart Prompts MCP Server!