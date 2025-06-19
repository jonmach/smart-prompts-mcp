---
name: code_review
title: Code Review Checklist
description: Comprehensive code review template with language-specific guidelines
category: coding
tags: [review, quality, best-practices, collaboration]
difficulty: intermediate
author: jezweb
version: 1.0.0
arguments:
  - name: language
    description: Programming language (e.g., JavaScript, Python, Java)
    required: true
  - name: pr_url
    description: URL of the pull request (optional)
    required: false
  - name: focus_areas
    description: Specific areas to focus on (e.g., security, performance)
    required: false
---

# Code Review for {{language}} {{#if pr_url}}({{pr_url}}){{/if}}

## Overview
Reviewing code written in **{{language}}** with focus on quality, maintainability, and best practices.
{{#if focus_areas}}
**Special focus on:** {{focus_areas}}
{{/if}}

## General Checklist

### Code Quality
- [ ] Code follows {{language}} style guidelines and conventions
- [ ] Functions and variables have descriptive, meaningful names
- [ ] No code duplication (DRY principle followed)
- [ ] Complex logic is well-commented
- [ ] Code is modular and follows single responsibility principle

### Error Handling
- [ ] All error cases are properly handled
- [ ] Error messages are informative and actionable
- [ ] No silent failures or swallowed exceptions
- [ ] Proper logging for debugging

### Performance
- [ ] No obvious performance bottlenecks
- [ ] Efficient algorithms and data structures used
- [ ] Database queries are optimized
- [ ] No memory leaks or resource management issues

### Security
- [ ] Input validation and sanitization
- [ ] No hardcoded secrets or credentials
- [ ] Proper authentication and authorization checks
- [ ] Protection against common vulnerabilities (SQL injection, XSS, etc.)

### Testing
- [ ] Adequate test coverage for new code
- [ ] Tests are meaningful and test actual behavior
- [ ] Edge cases are covered
- [ ] Tests are maintainable and readable

{{#if (eq language "JavaScript")}}
## JavaScript-Specific Checks
- [ ] Proper use of async/await and Promise handling
- [ ] No memory leaks from event listeners or timers
- [ ] Appropriate use of const/let (no var)
- [ ] Proper TypeScript types (if applicable)
{{/if}}

{{#if (eq language "Python")}}
## Python-Specific Checks
- [ ] PEP 8 compliance
- [ ] Proper use of type hints
- [ ] Virtual environment dependencies documented
- [ ] No mutable default arguments
{{/if}}

{{#if (eq language "Java")}}
## Java-Specific Checks
- [ ] Proper use of access modifiers
- [ ] Thread safety considerations
- [ ] Resource management with try-with-resources
- [ ] Appropriate use of design patterns
{{/if}}

## Additional Notes
_Add any specific observations or suggestions here_