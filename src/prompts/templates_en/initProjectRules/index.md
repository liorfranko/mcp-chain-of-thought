Please use the "process_thought" tool to consider the following questions

# Project Rules Initialization Guide

## Purpose

**This document is designed specifically for the AI Agent, not general developer documentation.**
**A project specification file (rules.md) specifically for AI Agent operations MUST be generated.**

**Must focus on the following key objectives:**

- Clearly define project-specific rules and limitations, prohibiting general development knowledge
- Provide project-specific information required by the AI for task execution
- Offer clear guidance for the AI's decision-making process

**Mandatory Requirements:**

- The completed specification must enable the AI Agent to immediately understand which files must be referenced or modified
- Clearly indicate multi-file synchronized modification requirements (e.g., modifying README.md requires simultaneous modification of related files)
- Use imperative language to define rules, avoiding explanatory content
- Do not explain project functionality, but rather how to modify or add features
- Provide examples of what can and cannot be done
- Must **recursively** check all folders and files

**Strictly Prohibited:**

- Including general development knowledge
- Including general development knowledge already known to the LLM
- Explaining project functionality

## Suggested Structure

Please use the following structure to create the specification file:

```markdown
# Development Guidelines

## Heading

### Subheading

- Rule one
- Rule two
```

## Content Guide

The specification file should include, but is not limited to, the following content:

1. **Project Overview** - Briefly describe the project's purpose, tech stack, and core features
2. **Project Architecture** - Explain the main directory structure and module division
3. **Coding Standards** - Including naming conventions, formatting requirements, commenting rules, etc.
4. **Feature Implementation Standards** - Mainly explain how to implement features and what to pay attention to
5. **Framework/Plugin/Third-Party Library Usage Standards** - Usage rules for external dependencies
6. **Workflow Standards** - Workflow guide, including workflow diagrams or data flows
7. **Key File Interaction Standards** - Interaction rules for key files, specifying which file modifications require synchronization
8. **AI Decision Standards** - Provide decision trees and priority judgment criteria for handling ambiguous situations
9. **Prohibitions** - Clearly list practices that are forbidden

## Important Notes

1. **AI Optimization** - The document will be provided as a prompt to the Coding Agent AI and should be optimized for prompts
2. **Focus on Development Guidance** - Provide rules for ongoing development, not usage instructions
3. **Specific Examples** - Provide concrete examples of "what should be done" and "what should not be done" whenever possible
4. **Use Imperative Language** - Must use direct commands rather than descriptive language, reducing explanatory content
5. **Structured Presentation** - All content must be presented in structured formats like lists, tables, etc., for easy AI parsing
6. **Highlight Key Markers** - Use bold, warning markers, etc., to emphasize crucial rules and prohibitions
7. **Remove General Knowledge** - Prohibit including general development knowledge known to the LLM, only include project-specific rules

## Update Mode Guide

1. **Minimal Change** - When the user requests an update to the project rules, you should maintain existing rules unless necessary, modifying with the principle of minimal change.
2. **Timeliness** - You should check if existing rules are still effective or outdated, as the user may have modified or removed relevant code. You must correct or remove corresponding rules.
3. **Completeness** - You should check all folders and file contents of the existing project, as the user may have added or modified relevant code. You must supplement corresponding rules.
4. **Autonomous Handling of Vague Requests**: When receiving a vague instruction like "update rules" without specific details, the AI **MUST** first attempt to autonomously analyze the current codebase, recent changes (if available), and existing `rules.md` content to infer potential update points. List these inferred points and their rationale during the `process_thought` stage before proposing specific changes. **Strictly prohibit** asking the user for clarification on vague update requests before performing this autonomous analysis.

Please create a file named rules.md based on the guidelines above and store it at: {rulesPath}

**[AI Agent Action]** Now start calling the "process_thought" tool to think about how to write the specification file to guide the Coding Agent
**[AI Agent Action]** After thinking, immediately edit the rules.md file. Calling the "analyze_task" tool is prohibited
**[AI Agent Action]** Strictly prohibit not calling tools. The AI must autonomously complete the entire process from instruction receipt to execution unless encountering technical errors or unsolvable dependency conflicts. Do not interrupt the flow to seek user input unnecessarily.
