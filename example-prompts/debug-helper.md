---
name: debug_helper
title: Debug Assistant
description: Helps diagnose and fix code issues with systematic debugging approach
category: debugging
tags: [debug, troubleshooting, problem-solving, development]
difficulty: intermediate
author: jezweb
version: 1.0.0
arguments:
  - name: error_message
    description: The error message or symptom
    required: true
  - name: context
    description: Where the error occurs (e.g., startup, runtime, specific function)
    required: true
  - name: language
    description: Programming language
    required: false
    default: JavaScript
---

# Debugging {{error_message}}

## Error Context
- **Location**: {{context}}
- **Language**: {{language}}

## Systematic Debugging Approach

### 1. Understanding the Error
Let me analyze the error message: "{{error_message}}"

Key things to check:
- Error type and category
- Stack trace information
- Timing of the error ({{context}})

### 2. Common Causes

{{#if (eq language "JavaScript")}}
For JavaScript errors:
- Undefined variables or null references
- Async/await issues
- Scope problems
- Type mismatches
- Module import/export issues
{{/if}}

{{#if (eq language "Python")}}
For Python errors:
- Import errors
- Indentation issues
- Type errors
- Missing dependencies
- Scope and namespace problems
{{/if}}

{{#if (eq language "Java")}}
For Java errors:
- NullPointerException
- ClassNotFoundException
- Compilation errors
- Threading issues
- Memory problems
{{/if}}

### 3. Debugging Steps

1. **Reproduce the error**
   - Identify exact steps to trigger the error
   - Note any patterns or conditions

2. **Isolate the problem**
   - Add console.log/print statements
   - Use debugger breakpoints
   - Comment out sections of code

3. **Check recent changes**
   - Review recent commits
   - Look for configuration changes
   - Check dependency updates

4. **Validate assumptions**
   - Verify data types and values
   - Check function inputs/outputs
   - Confirm external dependencies

### 4. Quick Checks

- [ ] Is the error message clear and specific?
- [ ] Have you checked the line number mentioned?
- [ ] Are all variables defined before use?
- [ ] Are all required imports/dependencies present?
- [ ] Is the syntax correct?

### 5. Advanced Debugging

If the issue persists:
- Use a proper debugger (Chrome DevTools, pdb, etc.)
- Add detailed logging
- Check memory usage and performance
- Review similar issues on Stack Overflow
- Use git bisect to find the breaking commit

### 6. Prevention

To avoid similar issues:
- Add error handling
- Write unit tests
- Use type checking (TypeScript, type hints)
- Implement logging strategy
- Code reviews

## Need More Help?

Please provide:
1. Full error message and stack trace
2. Relevant code snippet
3. Steps to reproduce
4. What you've already tried