---
title: "Claude Code Task Delegation Assistant"
description: "Helps formulate effective prompts for Claude Code with proper structure and context"
category: "development"
tags: ["claude-code","prompting","automation","development"]
difficulty: "intermediate"
author: "claude-commander"
version: "1.0"
created: "2025-06-19"
---

# Claude Code Task Delegation: {{task_type}}

**Project Context:** {{project_context}}
**Technology Stack:** {{tech_stack}}
**Complexity:** {{complexity}}

## Optimized Claude Code Prompt

{{#if (eq task_type "planning")}}
### Planning Mode Request

```
Plan how to {{task_description}} with the following specifications:

**Architecture Requirements:**
- {{architecture_requirements}}
- Follow {{tech_stack}} best practices
- Consider scalability and maintainability

**Constraints:**
- {{constraints}}
- Must integrate with existing {{project_context}}

**Deliverables:**
- Detailed implementation plan
- Architecture diagrams (text-based)
- Step-by-step breakdown
- Risk assessment
```
{{else}}
### Implementation Request

```
{{task_description}} using {{tech_stack}} with:

**Core Requirements:**
- {{core_requirements}}
- {{#if (eq complexity "high")}}Comprehensive error handling{{/if}}
- {{#if (eq complexity "medium")}}Basic error handling{{/if}}
- Input validation and security
- Following {{tech_stack}} conventions

**Technical Specifications:**
- {{technical_specs}}
- Performance: {{performance_requirements}}
- Testing: {{testing_requirements}}

**Integration:**
- Must work with existing {{project_context}}
- {{constraints}}

**Success Criteria:**
- {{success_criteria}}
```
{{/if}}

## Claude Code Execution Context

### Pre-execution Checklist
- [ ] Working directory set correctly
- [ ] Project context understood
- [ ] Dependencies identified
- [ ] Ready to grant permissions

### Expected Workflow
{{#if (eq task_type "planning")}}
1. Claude Code will analyze requirements
2. Create detailed plan in claude.md
3. Document architecture decisions
4. Provide implementation roadmap
{{else}}
1. Claude Code will read existing project structure
2. Implement requested functionality
3. Run tests and verify integration
4. Update documentation
5. Commit changes with descriptive messages
{{/if}}

### Monitoring Progress
- Check claude.md for decision rationale
- Monitor file changes in real-time
- Watch for permission requests
- Verify each milestone completion

## Troubleshooting

### If Claude Code Gets Stuck
- Check for pending permission requests
- Review claude.md for repeated attempts
- Provide clearer constraints if needed
- Break down complex tasks into smaller steps

### Loop Prevention
- Set explicit retry limits: "Try maximum 2 times"
- Provide escape routes: "If X fails, stop and report"
- Monitor claude.md for repetitive patterns

## Best Practices Applied

✅ **Specific Outcomes**: Clear deliverables defined
✅ **Technology Context**: {{tech_stack}} specified
✅ **Constraints**: Limitations clearly stated
✅ **Integration Awareness**: Existing {{project_context}} considered
✅ **Success Metrics**: Measurable criteria provided

## Next Steps

1. Copy the optimized prompt above
2. Ensure working directory is correct
3. Run Claude Code with the prompt
4. Grant permissions when requested
5. Monitor progress through claude.md
6. Verify completion against success criteria