import "dotenv/config";
import { loadPromptFromTemplate } from "./prompts/loader.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import express, { Request, Response, NextFunction } from "express";
import getPort from "get-port";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import { fileURLToPath } from "url";

// Import tool functions
import {
  planTask,
  planTaskSchema,
  analyzeTask,
  analyzeTaskSchema,
  reflectTask,
  reflectTaskSchema,
  splitTasks,
  splitTasksSchema,
  listTasksSchema,
  listTasks,
  executeTask,
  executeTaskSchema,
  verifyTask,
  verifyTaskSchema,
  completeTask,
  completeTaskSchema,
  deleteTask,
  deleteTaskSchema,
  clearAllTasks,
  clearAllTasksSchema,
  updateTaskContent,
  updateTaskContentSchema,
  queryTask,
  queryTaskSchema,
  getTaskDetail,
  getTaskDetailSchema,
} from "./tools/taskTools.js";

// Import thought chain tools
import {
  processThought,
  processThoughtSchema,
} from "./tools/thoughtChainTools.js";

// Import project tools
import {
  initProjectRules,
  initProjectRulesSchema,
} from "./tools/projectTools.js";

// Import task model functions
import { updateTaskConversationHistory, getTaskById } from "./models/taskModel.js";

async function main() {
  try {
    console.log("Starting MCP Chain of Thought service...");
    const ENABLE_GUI = process.env.ENABLE_GUI === "true";
    const ENABLE_DETAILED_MODE = process.env.ENABLE_DETAILED_MODE === "true";

    if (ENABLE_GUI) {
      // Create Express application
      const app = express();

      // List to store SSE clients
      let sseClients: Response[] = [];

      // Helper function to send SSE events
      function sendSseUpdate() {
        sseClients.forEach((client) => {
          // Check if client is still connected
          if (!client.writableEnded) {
            client.write(
              `event: update\ndata: ${JSON.stringify({
                timestamp: Date.now(),
              })}\n\n`
            );
          }
        });
        // Clean up disconnected clients (optional, but recommended)
        sseClients = sseClients.filter((client) => !client.writableEnded);
      }

      // Set up static file directory
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const publicPath = path.join(__dirname, "public");
      const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
      const TASKS_FILE_PATH = path.join(DATA_DIR, "tasks.json"); // Extract file path

      app.use(express.static(publicPath));

      // Set up API routes
      app.get("/api/tasks", async (req: Request, res: Response) => {
        try {
          // Use fsPromises to maintain asynchronous reading
          const tasksData = await fsPromises.readFile(TASKS_FILE_PATH, "utf-8");
          res.json(JSON.parse(tasksData));
        } catch (error) {
          // Ensure returning empty task list when file doesn't exist
          if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            res.json({ tasks: [] });
          } else {
            res.status(500).json({ error: "Failed to read tasks data" });
          }
        }
      });

      // Add: SSE endpoint
      app.get("/api/tasks/stream", (req: Request, res: Response) => {
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          // Optional: CORS headers, if frontend and backend are not on the same origin
          // "Access-Control-Allow-Origin": "*",
        });

        // Send an initial event or keep the connection
        res.write("data: connected\n\n");

        // Add client to the list
        sseClients.push(res);

        // When client disconnects, remove it from the list
        req.on("close", () => {
          sseClients = sseClients.filter((client) => client !== res);
        });
      });

      // Conversation history API endpoint (only when detailed mode is enabled)
      if (ENABLE_DETAILED_MODE) {
        app.get("/api/tasks/:taskId/conversation", async (req: Request, res: Response) => {
          try {
            const taskId = req.params.taskId;
            
            // Validate taskId
            if (!taskId) {
              res.status(400).json({ error: "Task ID is required" });
              return;
            }

            // Get task by ID
            const task = await getTaskById(taskId);
            
            // If task doesn't exist, return 404
            if (!task) {
              res.status(404).json({ error: "Task not found" });
              return;
            }
            
            // Return conversation history or empty array if it doesn't exist
            res.json({ conversationHistory: task.conversationHistory || [] });
          } catch (error) {
            console.error("Error retrieving conversation history:", error);
            res.status(500).json({ error: "Failed to retrieve conversation history" });
          }
        });
      }

      // Get available port
      const port = await getPort();

      // Start HTTP server
      const httpServer = app.listen(port, () => {
        // Start monitoring file changes after server starts
        try {
          // Check if file exists, if not, don't watch (avoid watch errors)
          if (fs.existsSync(TASKS_FILE_PATH)) {
            fs.watch(TASKS_FILE_PATH, (eventType, filename) => {
              if (
                filename &&
                (eventType === "change" || eventType === "rename")
              ) {
                // Slightly delay sending to prevent multiple triggers in a short time (e.g., when saving in editor)
                // debounce sendSseUpdate if needed
                sendSseUpdate();
              }
            });
          }
        } catch (watchError) {}
      });

      // Write the URL to WebGUI.md
      try {
        const websiteUrl = `[Task Manager UI](http://localhost:${port})`;
        const websiteFilePath = path.join(DATA_DIR, "WebGUI.md");
        await fsPromises.writeFile(websiteFilePath, websiteUrl, "utf-8");
      } catch (error) {}

      // Set up process termination event handler (ensure watcher is removed)
      const shutdownHandler = async () => {
        // Close all SSE connections
        sseClients.forEach((client) => client.end());
        sseClients = [];

        // Close HTTP server
        await new Promise<void>((resolve) => httpServer.close(() => resolve()));
        process.exit(0);
      };

      process.on("SIGINT", shutdownHandler);
      process.on("SIGTERM", shutdownHandler);
    }

    // Create MCP server
    const server = new Server(
      {
        name: "MCP Chain of Thought",
        version: "1.0.1",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "plan_task",
            description: loadPromptFromTemplate("toolsDescription/planTask.md"),
            inputSchema: zodToJsonSchema(planTaskSchema),
          },
          {
            name: "analyze_task",
            description: loadPromptFromTemplate(
              "toolsDescription/analyzeTask.md"
            ),
            inputSchema: zodToJsonSchema(analyzeTaskSchema),
          },
          {
            name: "reflect_task",
            description: loadPromptFromTemplate(
              "toolsDescription/reflectTask.md"
            ),
            inputSchema: zodToJsonSchema(reflectTaskSchema),
          },
          {
            name: "split_tasks",
            description: loadPromptFromTemplate(
              "toolsDescription/splitTasks.md"
            ),
            inputSchema: zodToJsonSchema(splitTasksSchema),
          },
          {
            name: "list_tasks",
            description: loadPromptFromTemplate(
              "toolsDescription/listTasks.md"
            ),
            inputSchema: zodToJsonSchema(listTasksSchema),
          },
          {
            name: "execute_task",
            description: loadPromptFromTemplate(
              "toolsDescription/executeTask.md"
            ),
            inputSchema: zodToJsonSchema(executeTaskSchema),
          },
          {
            name: "verify_task",
            description: loadPromptFromTemplate(
              "toolsDescription/verifyTask.md"
            ),
            inputSchema: zodToJsonSchema(verifyTaskSchema),
          },
          {
            name: "complete_task",
            description: loadPromptFromTemplate(
              "toolsDescription/completeTask.md"
            ),
            inputSchema: zodToJsonSchema(completeTaskSchema),
          },
          {
            name: "delete_task",
            description: loadPromptFromTemplate(
              "toolsDescription/deleteTask.md"
            ),
            inputSchema: zodToJsonSchema(deleteTaskSchema),
          },
          {
            name: "clear_all_tasks",
            description: loadPromptFromTemplate(
              "toolsDescription/clearAllTasks.md"
            ),
            inputSchema: zodToJsonSchema(clearAllTasksSchema),
          },
          {
            name: "update_task",
            description: loadPromptFromTemplate(
              "toolsDescription/updateTask.md"
            ),
            inputSchema: zodToJsonSchema(updateTaskContentSchema),
          },
          {
            name: "query_task",
            description: loadPromptFromTemplate(
              "toolsDescription/queryTask.md"
            ),
            inputSchema: zodToJsonSchema(queryTaskSchema),
          },
          {
            name: "get_task_detail",
            description: loadPromptFromTemplate(
              "toolsDescription/getTaskDetail.md"
            ),
            inputSchema: zodToJsonSchema(getTaskDetailSchema),
          },
          {
            name: "process_thought",
            description: loadPromptFromTemplate(
              "toolsDescription/processThought.md"
            ),
            inputSchema: zodToJsonSchema(processThoughtSchema),
          },
          {
            name: "init_project_rules",
            description: loadPromptFromTemplate(
              "toolsDescription/initProjectRules.md"
            ),
            inputSchema: zodToJsonSchema(initProjectRulesSchema),
          },
        ],
      };
    });

    server.setRequestHandler(
      CallToolRequestSchema,
      async (request: CallToolRequest) => {
        try {
          if (!request.params.arguments) {
            throw new Error("No arguments provided");
          }

          let parsedArgs;
          let taskId: string | undefined;
          let result;

          // Save request to conversation history if detailed mode is enabled
          // and this is a task-related tool request
          const saveRequest = async () => {
            if (ENABLE_DETAILED_MODE && taskId) {
              try {
                await updateTaskConversationHistory(
                  taskId,
                  'user',
                  JSON.stringify(request.params),
                  request.params.name
                );
              } catch (error) {
                // Silently handle errors to avoid interrupting the main flow
                console.error('Failed to save request to conversation history:', error);
              }
            }
          };

          // Save response to conversation history if detailed mode is enabled
          const saveResponse = async (response: any) => {
            if (ENABLE_DETAILED_MODE && taskId) {
              try {
                await updateTaskConversationHistory(
                  taskId,
                  'assistant',
                  JSON.stringify(response),
                  request.params.name
                );
              } catch (error) {
                // Silently handle errors to avoid interrupting the main flow
                console.error('Failed to save response to conversation history:', error);
              }
            }
          };

          switch (request.params.name) {
            case "plan_task":
              parsedArgs = await planTaskSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              result = await planTask(parsedArgs.data);
              return result;

            case "analyze_task":
              parsedArgs = await analyzeTaskSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              result = await analyzeTask(parsedArgs.data);
              return result;

            case "reflect_task":
              parsedArgs = await reflectTaskSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              result = await reflectTask(parsedArgs.data);
              return result;

            case "split_tasks":
              parsedArgs = await splitTasksSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              result = await splitTasks(parsedArgs.data);
              return result;

            case "list_tasks":
              parsedArgs = await listTasksSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              result = await listTasks(parsedArgs.data);
              return result;

            case "execute_task":
              parsedArgs = await executeTaskSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              taskId = parsedArgs.data.taskId;
              await saveRequest();
              result = await executeTask(parsedArgs.data);
              await saveResponse(result);
              return result;

            case "verify_task":
              parsedArgs = await verifyTaskSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              taskId = parsedArgs.data.taskId;
              await saveRequest();
              result = await verifyTask(parsedArgs.data);
              await saveResponse(result);
              return result;

            case "complete_task":
              parsedArgs = await completeTaskSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              taskId = parsedArgs.data.taskId;
              await saveRequest();
              result = await completeTask(parsedArgs.data);
              await saveResponse(result);
              return result;

            case "delete_task":
              parsedArgs = await deleteTaskSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              result = await deleteTask(parsedArgs.data);
              return result;

            case "clear_all_tasks":
              parsedArgs = await clearAllTasksSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              result = await clearAllTasks(parsedArgs.data);
              return result;

            case "update_task":
              parsedArgs = await updateTaskContentSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              taskId = parsedArgs.data.taskId;
              await saveRequest();
              result = await updateTaskContent(parsedArgs.data);
              await saveResponse(result);
              return result;

            case "query_task":
              parsedArgs = await queryTaskSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              result = await queryTask(parsedArgs.data);
              return result;

            case "get_task_detail":
              parsedArgs = await getTaskDetailSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              result = await getTaskDetail(parsedArgs.data);
              return result;

            case "process_thought":
              parsedArgs = await processThoughtSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              result = await processThought(parsedArgs.data);
              return result;

            case "init_project_rules":
              result = await initProjectRules();
              return result;

            default:
              throw new Error(`Tool ${request.params.name} does not exist`);
          }
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          return {
            content: [
              {
                type: "text",
                text: `Error occurred: ${errorMsg} \n Please try correcting the error and calling the tool again`,
              },
            ],
          };
        }
      }
    );

    // Establish connection
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.log("MCP Chain of Thought service started");
  } catch (error) {
    process.exit(1);
  }
}

main().catch(console.error);
