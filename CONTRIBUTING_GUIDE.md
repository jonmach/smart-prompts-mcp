# 🚀 Complete Guide to Contributing Back to prompts-mcp-server

This guide will walk you through every step of contributing your enhancements back to the original repository.

## 📋 Prerequisites

- GitHub account (you have this ✓)
- Git installed locally (you have this ✓)
- Your enhanced fork ready (you have this ✓)

## 🔄 Step 1: Fork the Original Repository

1. **Go to**: https://github.com/tanker327/prompts-mcp-server
2. **Click**: The "Fork" button (top right)
3. **Select**: Your account (jezweb)
4. **Wait**: For the fork to complete

This creates your own copy of their repository under your account.

## 🔗 Step 2: Set Up Your Local Repository

We need to set up git remotes to track both repositories:

```bash
# Navigate to your project
cd /home/jez/claude/prompts/smart-prompts-mcp

# Add the original repository as 'upstream'
git remote add upstream https://github.com/tanker327/prompts-mcp-server.git

# Verify remotes
git remote -v
# Should show:
# origin    https://github.com/jezweb/smart-prompts-mcp.git (fetch/push)
# upstream  https://github.com/tanker327/prompts-mcp-server.git (fetch/push)

# Fetch the upstream branches
git fetch upstream
```

## 🌿 Step 3: Create Feature Branches

We'll create separate branches for each feature to make PRs manageable:

```bash
# Create branch for enhanced tool descriptions
git checkout -b feature/enhanced-tool-descriptions

# Create branch for GitHub integration
git checkout -b feature/github-integration

# Create branch for advanced search
git checkout -b feature/advanced-search

# Create branch for prompt composition
git checkout -b feature/prompt-composition

# Return to main branch
git checkout main
```

## 📝 Step 4: Prepare the First PR (Enhanced Tool Descriptions)

Let's start with the smallest, most valuable change:

### Branch: `feature/enhanced-tool-descriptions`

This PR will include:
- Better tool descriptions with workflow guidance
- Help system implementation
- Enhanced error messages
- Examples in tool schemas

Files to include:
- Modified `src/tools.ts` (selected improvements)
- New help functionality
- Updated tests
- Documentation updates

## 🎯 Step 5: Create the Issue

1. **Go to**: https://github.com/tanker327/prompts-mcp-server/issues
2. **Click**: "New Issue"
3. **Copy**: The content from `ISSUE_DRAFT.md`
4. **Submit**: The issue

## 📊 Step 6: Track Responses

After posting the issue, the maintainer might:
- ✅ Show interest → Proceed with PRs
- 🤔 Ask questions → Provide clarification
- 🔄 Suggest changes → Adapt approach
- ❌ Decline → Maintain separate fork

## 🛠️ Detailed PR Preparation

### PR 1: Enhanced Tool Descriptions

**Changes to include:**
1. Improved tool descriptions
2. Workflow guidance
3. Better error messages
4. Basic help system

**Files involved:**
- `src/tools.ts` - Enhanced descriptions only
- Tests for new functionality
- README updates

### PR 2: GitHub Integration (Core)

**Changes to include:**
1. GitHub fetcher module
2. Configuration for GitHub
3. Backwards compatibility layer
4. Basic GitHub operations

**Files involved:**
- `src/github.ts` (new)
- `src/config.ts` (enhanced)
- Integration with existing cache
- Tests and documentation

### PR 3: Advanced Search

**Changes to include:**
1. Category filtering
2. Tag filtering  
3. Similar prompt suggestions
4. Search improvements

**Files involved:**
- Search enhancements
- Cache improvements
- New search tests

### PR 4: Prompt Composition

**Changes to include:**
1. Compose tool
2. Template handling
3. Separator support

**Files involved:**
- Composition logic
- New tool handler
- Tests and examples

## 🎬 Action Items for You

### Right Now:
1. **Fork the original repo** on GitHub
2. **Run the git remote commands** above
3. **Create the feature branches**
4. **Post the issue** to start discussion

### After Maintainer Response:
1. **Prepare first PR** based on feedback
2. **Submit PR** with clear description
3. **Respond to reviews** promptly
4. **Iterate** based on feedback

## 💡 Tips for Success

1. **Start Small**: First PR should be easy to review
2. **Clear Communication**: Explain the why, not just the what
3. **Be Patient**: Maintainers are volunteers
4. **Stay Positive**: Accept feedback gracefully
5. **Test Everything**: Include comprehensive tests
6. **Document Well**: Update README and add examples

## 📚 PR Template

When creating each PR, use this template:

```markdown
## Description
Brief description of what this PR adds/changes

## Motivation
Why this change is valuable

## Changes
- Bullet list of specific changes
- File modifications
- New features added

## Testing
- How to test the changes
- What tests were added

## Screenshots (if applicable)
Before/after comparisons

## Backwards Compatibility
Confirmation that existing functionality is preserved

## Related Issue
Fixes #[issue number]
```

## 🤝 If They Prefer Separate Projects

If the maintainer prefers to keep projects separate:

1. **Update your README** to clearly attribute the original
2. **Add comparison doc** showing differences
3. **Cross-reference** in both projects
4. **Collaborate** on shared improvements
5. **Maintain compatibility** for easy switching

## ✅ Success Metrics

You'll know you're successful when:
- Issue gets positive response
- PRs are reviewed and merged
- Community benefits from improvements
- Both projects thrive

## 🚨 Common Pitfalls to Avoid

1. **Don't make huge PRs** - Keep them focused
2. **Don't break compatibility** - Test thoroughly
3. **Don't be pushy** - Respect maintainer's time
4. **Don't forget tests** - Match their standards
5. **Don't assume** - Ask when unsure

Ready to start? Let's begin with forking the repository!