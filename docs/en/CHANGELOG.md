[English](../../CHANGELOG.md)

# Changelog

## [1.0.13]

### Fixes

- Fix: Corrected invariantlabs misjudgment issue (148f0cd)

## [1.0.12]

### Additions

- Added Shrimp Task Manager demo video link to README and Chinese README, and added demo video image file. (406eb46)
- Added JSON format notes, emphasizing prohibition of comments and special character escape requirements to avoid parsing failures. (a328322)
- Added web graphical interface feature, controlled via the `ENABLE_GUI` environment variable. (bf5f367)

### Removals

- Removed several unnecessary error log outputs to avoid Cursor errors. (552eed8)

## [1.0.11]

### Changes

- Removed functions that are no longer used. (f8d9c8)

### Fixes

- Fix: Corrected issue where Cursor Console doesn't support Chinese. (00943e1)

## [1.0.10]

### Changes

- Added project rule update mode guide, emphasizing recursive checking of all folders and files, and standardizing autonomous handling processes for vague requests. (989af20)
- Added prompt language and customization instructions, updated README and Chinese documentation. (d0c3bfa)
- Added `TEMPLATES_USE` configuration option to support custom prompt templates, updated README and Chinese documentation. (76315fe)
- Added multi-language support for task templates (English/Chinese). (291c5ee)
- Added multiple task-related prompt generators and templates (delete, clear, update tasks). (a51110f, 52994d5, 304e0cd)
- Adjusted task templates to Markdown format for easier multi-language support and modification. (5513235)
- Adjusted the "batch submission" parameter limit for the `split_tasks` tool from 8000 characters to 5000 characters. (a395686)
- Removed task-related file update tools that are no longer used. (fc1a5c8)
- Updated README and Chinese documentation: Added "Recommended Models", linked MIT license, added Star History, added table of contents and tags, strengthened usage guide. (5c61b3e, f0283ff, 0bad188, 31065fa)
- Updated task content description: Allowing completed tasks to update related file summaries, adjusted thinking process description. (b07672c)
- Updated task templates: Added "Please strictly follow the following guidance" prompt to strengthen guidance. (f0283ff)

### Fixes

- Fixed issue where some models might not follow the process. (ffd6349)
- Fixed #6: Corrected issue with simplified and traditional Chinese causing Enum parameter judgment errors. (dae3756)

## [1.0.8]

### Additions

- Added zod-to-json-schema dependency for better structure definition integration
- Added detailed task splitting guide, improving task management experience
- Added more powerful Agent tool call error handling mechanism

### Changes

- Updated MCP SDK integration method, improving error handling and compatibility
- Improved task implementation prompt templates, making instructions clearer
- Optimized task splitting tool description and parameter validation

### Fixes

- Fixed issue #5, corrected problem where some Agents couldn't properly handle errors
- Fixed line formatting in template files, improving readability

## [1.0.7]

### Additions

- Added thought chain process feature for systematic problem analysis
- Added project rule initialization feature for maintaining project consistency

### Changes

- Updated related documentation, emphasizing systematic problem analysis and project consistency maintenance
- Adjusted tool list to include new features
- Updated .gitignore to exclude unnecessary folders 