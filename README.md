# MCP Chain of Thought

[![Chain of Thought Demo](/docs/youtube.png)](https://youtu.be/hzOCwwGSQhs)
[![smithery badge](https://smithery.ai/badge/@liorfranko/mcp-chain-of-thought)](https://smithery.ai/server/@liorfranko/mcp-chain-of-thought)

> 🚀 An intelligent task management system based on Model Context Protocol (MCP), providing an efficient programming workflow framework for AI Agents.

<a href="https://glama.ai/mcp/servers/@liorfranko/mcp-chain-of-thought">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@liorfranko/mcp-chain-of-thought/badge" />
</a>

## 📑 Table of Contents

- [✨ Features](#features)
- [🧭 Usage Guide](#usage-guide)
- [🔧 Installation](#installation)
- [🔌 Using with MCP-Compatible Clients](#clients)
- [🛠️ Tools Overview](#tools)
- [🤖 Recommended Models](#recommended)
- [📄 License](#license)
- [📚 Documentation](#documentation)

## ✨ Features

- **🧠 Task Planning & Analysis**: Deep understanding of complex task requirements
- **🧩 Intelligent Task Decomposition**: Break down large tasks into manageable smaller tasks
- **🔄 Dependency Management & Status Tracking**: Handle dependencies and monitor progress
- **✅ Task Verification**: Ensure results meet requirements
- **💾 Task Memory**: Store task history for reference and learning
- **⛓️ Thought Chain Process**: Step-by-step reasoning for complex problems
- **📋 Project Rules**: Define standards to maintain consistency
- **🔄 Automatic Project Rules Updates**: Project rules update task automatically added to every task list to keep documentation in sync with code
- **🌐 Web GUI**: Optional web interface (enable with `ENABLE_GUI=true`)
- **📝 Detailed Mode**: View conversation history (enable with `ENABLE_DETAILED_MODE=true`)

## 🧭 Usage Guide

### 🚀 Quick Start

1. **🔽 Installation**: [Install MCP Chain of Thought](#installation) via Smithery or manually
2. **🏁 Initial Setup**: Tell the Agent "init project rules" to establish project-specific guidelines
3. **📝 Plan Tasks**: Use "plan task [description]" to create a development plan
4. **👀 Review & Feedback**: Provide feedback during the planning process
5. **▶️ Execute Tasks**: Use "execute task [name/ID]" to implement a specific task
6. **🔄 Continuous Mode**: Say "continuous mode" to process all tasks sequentially

### 🔍 Memory & Thinking Features

- **💾 Task Memory**: Automatically saves execution history for reference
- **🔄 Thought Chain**: Enables systematic reasoning through `process_thought` tool
- **📋 Project Rules**: Maintains consistency across your codebase

## 🔧 Installation

### 🔽 Via Smithery
```bash
npx -y @smithery/cli install @liorfranko/mcp-chain-of-thought --client claude
```

### 🔽 Manual Installation
```bash
npm install
npm run build
```

## 🔌 Using with MCP-Compatible Clients

### ⚙️ Configuration in Cursor IDE

Add to your Cursor configuration file (`~/.cursor/mcp.json` or project-specific `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "chain-of-thought": {
      "command": "npx",
      "args": ["-y", "mcp-chain-of-thought"],
      "env": {
        "DATA_DIR": "/path/to/project/data", // Must use absolute path
        "ENABLE_THOUGHT_CHAIN": "true",
        "TEMPLATES_USE": "en",
        "ENABLE_GUI": "true",
        "ENABLE_DETAILED_MODE": "true"
      }
    }
  }
}
```

> ⚠️ **Important**: `DATA_DIR` must use an absolute path.

### 🔧 Environment Variables

- **📁 DATA_DIR**: Directory for storing task data (absolute path required)
- **🧠 ENABLE_THOUGHT_CHAIN**: Controls detailed thinking process (default: true)
- **🌐 TEMPLATES_USE**: Template language (default: en)
- **🖥️ ENABLE_GUI**: Enables web interface (default: false)
- **📝 ENABLE_DETAILED_MODE**: Shows conversation history (default: false)

## 🛠️ Tools Overview

| Category          | Tool                  | Description                                |
|-------------------|------------------------|--------------------------------------------|
| 📋 Planning       | `plan_task`            | Start planning tasks                       |
|                   | `analyze_task`         | Analyze requirements                       |
|                   | `process_thought`      | Step-by-step reasoning                     |
|                   | `reflect_task`         | Improve solution concepts                  |
|                   | `init_project_rules`   | Set project standards                      |
| 🧩 Management     | `split_tasks`          | Break into subtasks                        |
|                   | `list_tasks`           | Show all tasks                             |
|                   | `query_task`           | Search tasks                               |
|                   | `get_task_detail`      | Show task details                          |
|                   | `delete_task`          | Remove tasks                               |
| ▶️ Execution      | `execute_task`         | Run specific tasks                         |
|                   | `verify_task`          | Verify completion                          |
|                   | `complete_task`        | Mark as completed                          |

## 🤖 Recommended Models

- **👑 Claude 3.7**: Offers strong understanding and generation capabilities
- **💎 Gemini 2.5**: Google's latest model, performs excellently

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📚 Documentation

- [🏗️ System Architecture](docs/en/architecture.md)
- [🧪 Testing Guide](docs/en/testing.md)
- [🔧 Prompt Customization Guide](docs/en/prompt-customization.md)
- [🔄 Project Rules Update Task](docs/en/project-rules-update-task.md)
- [📝 Changelog](CHANGELOG.md)

## 🧪 Running Tests

### Standard Tests (Jest)
```bash
npm test
```
## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=liorfranko/mcp-chain-of-thought&type=Timeline)](https://www.star-history.com/#liorfranko/mcp-chain-of-thought&Timeline)
