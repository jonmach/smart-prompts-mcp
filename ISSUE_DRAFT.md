# Draft Issue for upstream repository

## Title: Enhancement Proposal: GitHub Integration and Advanced Features for prompts-mcp-server

Hi @tanker327! 👋

First, thank you for creating prompts-mcp-server! It's a fantastic foundation for managing prompts with MCP. I've been using it extensively and have developed some enhancements that I believe could benefit the broader community.

## 🚀 Overview of Enhancements

I've created an enhanced fork that adds several powerful features while maintaining full backwards compatibility with your original implementation. I'd love to contribute these back to the main project if you're interested.

## ✨ Key Features Added

### 1. **GitHub Integration** 
- Fetch prompts directly from GitHub repositories (public or private)
- No local storage required (but still supported for backwards compatibility)
- Real-time sync with GitHub for always up-to-date prompts
- Recursive directory support for organized prompt libraries

### 2. **Enhanced AI Assistant Experience**
- Clear workflow guidance to help AI assistants use tools effectively
- Intelligent error messages that suggest next steps
- Comprehensive help system with topics (workflow, examples, best practices)
- Tool descriptions that emphasize the search → retrieve → create workflow

### 3. **Advanced Search & Discovery**
- Search by keywords across title, description, and content
- Filter by category and tags
- Get suggestions for similar prompts when exact matches aren't found
- List categories with prompt counts

### 4. **Prompt Composition**
- Combine multiple prompts into workflows
- Support for custom separators
- Reuse existing prompts in new combinations

### 5. **Developer Experience Improvements**
- Enhanced TypeScript types with better strictness
- Modular architecture improvements
- Comprehensive error handling
- Extended test coverage

## 🔧 Technical Details

- **Fully backwards compatible** - existing users won't see any breaking changes
- **Opt-in GitHub features** - local file storage remains the default
- **Comprehensive tests** - all new features include test coverage
- **Modular design** - features are cleanly separated into modules

## 📊 Real-World Usage

I've been using these enhancements in production with multiple AI assistants (Claude, Roo Cline) and the improvements have significantly reduced confusion and improved prompt discovery. The GitHub integration has been particularly valuable for team collaboration.

## 🤝 Contribution Approach

I understand that reviewing large PRs can be challenging, so I'm proposing to contribute these features in smaller, focused PRs:

1. **Enhanced tool descriptions and help system** (small, immediate value)
2. **Core GitHub integration** (medium, backwards compatible)
3. **Advanced search features** (small, builds on existing search)
4. **Prompt composition** (small, new capability)

Each PR would include:
- Comprehensive tests
- Documentation updates
- Examples
- No breaking changes

## 🔗 Resources

- **My enhanced fork**: https://github.com/jezweb/smart-prompts-mcp
- **Live example prompts repo**: https://github.com/jezweb/prompts
- **Detailed enhancements doc**: [ENHANCEMENTS.md](https://github.com/jezweb/smart-prompts-mcp/blob/main/ENHANCEMENTS.md)

## ❓ Questions for You

1. Would you be interested in these enhancements for the main project?
2. Do you prefer the phased PR approach or would you like to see everything at once?
3. Are there any features you'd like me to prioritize or modify?
4. Any concerns about backwards compatibility or architectural decisions?

I'm flexible on the approach and happy to adjust based on your preferences. If you'd prefer to keep the projects separate, I'm also happy to maintain my fork as a "GitHub-enhanced" variant with clear attribution to your original work.

Thank you for considering these enhancements! I'm excited about the possibility of contributing back to make prompts-mcp-server even more powerful for the community.

Best regards,
jezweb