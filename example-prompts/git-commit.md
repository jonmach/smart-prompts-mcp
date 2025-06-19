---
name: git_commit
title: Git Commit Message Generator
description: Generate conventional commit messages following best practices
category: git
tags: [git, commits, version-control, conventions]
difficulty: beginner
author: jezweb
version: 1.0.0
arguments:
  - name: type
    description: Type of change (feat, fix, docs, style, refactor, test, chore)
    required: true
  - name: scope
    description: Scope of the change (e.g., auth, api, ui)
    required: false
  - name: description
    description: Short description of the change
    required: true
  - name: breaking
    description: Is this a breaking change? (yes/no)
    required: false
    default: no
  - name: issues
    description: Related issue numbers (comma-separated)
    required: false
---

# Git Commit Message

```
{{type}}{{#if scope}}({{scope}}){{/if}}{{#if (eq breaking "yes")}}!{{/if}}: {{description}}

{{#if (eq breaking "yes")}}
BREAKING CHANGE: This commit contains breaking changes.
Users will need to update their code accordingly.

{{/if}}
{{#if issues}}
Closes: {{#each (split issues ",")}}#{{trim this}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}
```

## Commit Type Guidelines

Based on your commit type **{{type}}**, here are some guidelines:

{{#if (eq type "feat")}}
### Feature Commits
- Add new functionality
- Introduce new capabilities
- Enhance existing features
- Example: "feat(auth): add OAuth2 integration"
{{/if}}

{{#if (eq type "fix")}}
### Bug Fix Commits
- Fix incorrect behavior
- Resolve reported issues
- Patch security vulnerabilities
- Example: "fix(api): handle null response correctly"
{{/if}}

{{#if (eq type "docs")}}
### Documentation Commits
- Update README files
- Improve code comments
- Add or update API documentation
- Example: "docs(readme): add installation instructions"
{{/if}}

{{#if (eq type "style")}}
### Style Commits
- Format code (whitespace, semicolons, etc.)
- Fix linting errors
- Improve code readability (no functional changes)
- Example: "style(ui): format CSS files"
{{/if}}

{{#if (eq type "refactor")}}
### Refactor Commits
- Restructure code without changing behavior
- Improve code quality
- Optimize performance
- Example: "refactor(utils): simplify date parsing logic"
{{/if}}

{{#if (eq type "test")}}
### Test Commits
- Add missing tests
- Fix broken tests
- Improve test coverage
- Example: "test(auth): add unit tests for login flow"
{{/if}}

{{#if (eq type "chore")}}
### Chore Commits
- Update dependencies
- Configure build tools
- Maintain project infrastructure
- Example: "chore(deps): update npm packages"
{{/if}}

## Best Practices Reminder

1. **Keep it concise**: Subject line should be 50 characters or less
2. **Use imperative mood**: "add" not "added" or "adds"
3. **Don't end with period**: No punctuation at the end of subject
4. **Separate concerns**: One commit per logical change
5. **Reference issues**: Link to relevant tickets or issues

## Extended Commit Message Template

If you need a more detailed commit message:

```
{{type}}{{#if scope}}({{scope}}){{/if}}: {{description}}

# Why is this change necessary?
[Explain the problem this commit solves]

# How does it address the issue?
[Describe your solution]

# What side effects does this change have?
[List any impacts or considerations]

{{#if breaking}}
BREAKING CHANGE: [Describe what breaks and how to migrate]
{{/if}}

{{#if issues}}
Closes: {{#each (split issues ",")}}#{{trim this}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}
```