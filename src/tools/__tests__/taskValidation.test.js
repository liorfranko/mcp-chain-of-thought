import { jest } from '@jest/globals';
import { z } from 'zod';
import {
  planTaskSchema,
  analyzeTaskSchema,
  reflectTaskSchema,
  splitTasksSchema,
  listTasksSchema,
  executeTaskSchema,
  verifyTaskSchema,
  completeTaskSchema,
  deleteTaskSchema,
  clearAllTasksSchema,
  updateTaskContentSchema,
  queryTaskSchema,
  getTaskDetailSchema
} from '../../tools/taskTools.ts';
import { RelatedFileType } from '../../types/index.js';

describe('Task Tools Schema Validation', () => {
  // Helper function to test schema validation
  const testSchemaValidation = (schema, validData, invalidDataList) => {
    // Test with valid data
    expect(() => schema.parse(validData)).not.toThrow();

    // Test with invalid data
    for (const { data, error } of invalidDataList) {
      try {
        schema.parse(data);
        // If we reach here, validation didn't throw
        fail(`Expected schema validation to fail for ${JSON.stringify(data)}, but it passed`);
      } catch (err) {
        expect(err).toBeInstanceOf(z.ZodError);
        if (error) {
          // If a specific error message is expected, check if any error contains it
          const errorMessages = err.errors.map(e => e.message);
          // Log the error messages for debugging
          console.log(`Expected error: "${error}"`);
          console.log(`Actual errors: ${JSON.stringify(errorMessages)}`);
          
          // Use a more lenient comparison approach
          const hasExpectedError = errorMessages.some(msg => 
            msg.toLowerCase().includes(error.toLowerCase()) || 
            error.toLowerCase().includes(msg.toLowerCase())
          );
          expect(hasExpectedError).toBeTruthy();
        }
      }
    }
  };

  describe('planTaskSchema validation', () => {
    test('should validate planTaskSchema correctly', () => {
      const validData = {
        description: 'A detailed task description that has more than 10 characters',
        requirements: 'Optional requirements',
        existingTasksReference: true
      };

      const invalidDataList = [
        { 
          data: { description: 'Short' }, 
          error: 'less than 10 characters' 
        },
        { 
          data: { requirements: 'Requirements without description' }, 
          error: 'required' 
        },
        { 
          data: { description: 'Valid description', existingTasksReference: 'not-a-boolean' }, 
          error: 'Expected boolean' 
        }
      ];

      testSchemaValidation(planTaskSchema, validData, invalidDataList);
    });
  });

  describe('analyzeTaskSchema validation', () => {
    test('should validate analyzeTaskSchema correctly', () => {
      const validData = {
        summary: 'A clear task summary with more than 10 characters',
        initialConcept: 'A detailed solution concept that describes the approach and is at least 50 characters long'
      };

      const invalidDataList = [
        { 
          data: { summary: 'Short', initialConcept: 'Detailed initial concept with sufficient length' }, 
          error: 'less than 10 characters' 
        },
        { 
          data: { summary: 'Valid summary', initialConcept: 'Short' }, 
          error: 'less than 50 characters' 
        },
        { 
          data: { initialConcept: 'Detailed initial concept with sufficient length' }, 
          error: 'required' 
        },
        { 
          data: { summary: 'Valid summary' }, 
          error: 'required' 
        }
      ];

      testSchemaValidation(analyzeTaskSchema, validData, invalidDataList);
    });
  });

  describe('reflectTaskSchema validation', () => {
    test('should validate reflectTaskSchema correctly', () => {
      const validData = {
        summary: 'A clear task summary with more than 10 characters',
        analysis: 'A comprehensive analysis that includes technical details, components, and implementation plans. This text is intentionally long to meet the minimum requirement of 100 characters.'
      };

      const invalidDataList = [
        { 
          data: { summary: 'Short', analysis: 'Detailed analysis with sufficient length to meet requirements' }, 
          error: 'less than 10 characters' 
        },
        { 
          data: { summary: 'Valid summary', analysis: 'Short analysis' }, 
          error: 'less than 100 characters' 
        },
        { 
          data: { analysis: 'Detailed analysis with sufficient length to meet requirements' }, 
          error: 'required' 
        },
        { 
          data: { summary: 'Valid summary' }, 
          error: 'required' 
        }
      ];

      testSchemaValidation(reflectTaskSchema, validData, invalidDataList);
    });
  });

  describe('splitTasksSchema validation', () => {
    test('should validate splitTasksSchema correctly', () => {
      const validData = {
        updateMode: 'clearAllTasks',
        tasks: [
          {
            name: 'Task 1',
            description: 'A detailed task description',
            implementationGuide: 'Step-by-step implementation guide',
            dependencies: ['task-id-1', 'task-id-2'],
            relatedFiles: [
              {
                path: 'src/file.js',
                type: RelatedFileType.TO_MODIFY,
                description: 'File to modify',
                lineStart: 10,
                lineEnd: 20
              }
            ],
            verificationCriteria: 'Verification steps'
          }
        ],
        globalAnalysisResult: 'Global analysis for all tasks'
      };

      const invalidDataList = [
        { 
          data: { updateMode: 'invalid-mode', tasks: [{ name: 'Task', description: 'Description', implementationGuide: 'Guide' }] }, 
          error: 'Invalid enum value' 
        },
        { 
          data: { updateMode: 'clearAllTasks', tasks: [] }, 
          error: 'at least one task' 
        },
        { 
          data: { updateMode: 'clearAllTasks', tasks: [{ name: 'Task', implementationGuide: 'Guide' }] }, 
          error: 'required' 
        },
        { 
          data: { updateMode: 'clearAllTasks', tasks: [{ description: 'Description', implementationGuide: 'Guide' }] }, 
          error: 'required' 
        },
        { 
          data: { updateMode: 'clearAllTasks', tasks: [{ name: 'Task', description: 'Description' }] }, 
          error: 'required' 
        },
        { 
          data: { 
            updateMode: 'clearAllTasks', 
            tasks: [{ 
              name: 'Task', 
              description: 'Description', 
              implementationGuide: 'Guide',
              relatedFiles: [{ type: RelatedFileType.TO_MODIFY, description: 'Missing path' }] 
            }] 
          }, 
          error: 'required' 
        },
        { 
          data: { 
            updateMode: 'clearAllTasks', 
            tasks: [{ 
              name: 'Task', 
              description: 'Description', 
              implementationGuide: 'Guide',
              relatedFiles: [{ path: 'src/file.js', description: 'Missing type' }] 
            }] 
          }, 
          error: 'required' 
        },
        { 
          data: { 
            updateMode: 'clearAllTasks', 
            tasks: [{ 
              name: 'Task', 
              description: 'Description', 
              implementationGuide: 'Guide',
              relatedFiles: [{ path: 'src/file.js', type: RelatedFileType.TO_MODIFY }] 
            }] 
          }, 
          error: 'required' 
        }
      ];

      testSchemaValidation(splitTasksSchema, validData, invalidDataList);
    });
  });

  describe('listTasksSchema validation', () => {
    test('should validate listTasksSchema correctly', () => {
      const validValues = ['all', 'pending', 'in_progress', 'completed'];
      
      // Test all valid status values
      for (const status of validValues) {
        expect(() => listTasksSchema.parse({ status })).not.toThrow();
      }

      // Test invalid status
      try {
        listTasksSchema.parse({ status: 'invalid-status' });
        fail('Expected schema validation to fail for invalid status, but it passed');
      } catch (err) {
        expect(err).toBeInstanceOf(z.ZodError);
        expect(err.errors[0].message).toContain('Invalid enum value');
      }
    });
  });

  describe('executeTaskSchema validation', () => {
    test('should validate executeTaskSchema correctly', () => {
      const validData = {
        taskId: '123e4567-e89b-12d3-a456-426614174000'
      };

      const invalidDataList = [
        { 
          data: { taskId: 'not-a-uuid' }, 
          error: 'Invalid uuid' 
        },
        { 
          data: {}, 
          error: 'required' 
        }
      ];

      testSchemaValidation(executeTaskSchema, validData, invalidDataList);
    });
  });

  describe('verifyTaskSchema validation', () => {
    test('should validate verifyTaskSchema correctly', () => {
      const validData = {
        taskId: '123e4567-e89b-12d3-a456-426614174000'
      };

      const invalidDataList = [
        { 
          data: { taskId: 'not-a-uuid' }, 
          error: 'Invalid uuid' 
        },
        { 
          data: {}, 
          error: 'required' 
        }
      ];

      testSchemaValidation(verifyTaskSchema, validData, invalidDataList);
    });
  });

  describe('completeTaskSchema validation', () => {
    test('should validate completeTaskSchema correctly', () => {
      const validData = {
        taskId: '123e4567-e89b-12d3-a456-426614174000',
        summary: 'A detailed completion summary that describes what was accomplished in at least 30 characters'
      };

      const validDataWithoutSummary = {
        taskId: '123e4567-e89b-12d3-a456-426614174000'
      };

      const invalidDataList = [
        { 
          data: { taskId: 'not-a-uuid', summary: 'Detailed completion summary' }, 
          error: 'Invalid uuid' 
        },
        { 
          data: { summary: 'Detailed completion summary' }, 
          error: 'required' 
        },
        { 
          data: { taskId: '123e4567-e89b-12d3-a456-426614174000', summary: 'Short' }, 
          error: 'less than 30 characters' 
        }
      ];

      // Test with valid data including summary
      testSchemaValidation(completeTaskSchema, validData, invalidDataList);
      
      // Test valid data without summary (it's optional)
      expect(() => completeTaskSchema.parse(validDataWithoutSummary)).not.toThrow();
    });
  });

  describe('deleteTaskSchema validation', () => {
    test('should validate deleteTaskSchema correctly', () => {
      const validData = {
        taskId: '123e4567-e89b-12d3-a456-426614174000'
      };

      const invalidDataList = [
        { 
          data: { taskId: 'not-a-uuid' }, 
          error: 'Invalid uuid' 
        },
        { 
          data: {}, 
          error: 'required' 
        }
      ];

      testSchemaValidation(deleteTaskSchema, validData, invalidDataList);
    });
  });

  describe('clearAllTasksSchema validation', () => {
    test('should validate clearAllTasksSchema correctly', () => {
      const validData = {
        confirm: true
      };

      const invalidDataList = [
        { 
          data: { confirm: false }, 
          error: 'Invalid input' 
        },
        { 
          data: { confirm: 'not-a-boolean' }, 
          error: 'Expected boolean' 
        },
        { 
          data: {}, 
          error: 'required' 
        }
      ];

      testSchemaValidation(clearAllTasksSchema, validData, invalidDataList);
    });
  });

  describe('updateTaskContentSchema validation', () => {
    test('should validate updateTaskContentSchema correctly', () => {
      const validData = {
        taskId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'New task name',
        description: 'New task description',
        notes: 'New notes',
        dependencies: ['dep-1', 'dep-2'],
        relatedFiles: [
          {
            path: 'src/file.js',
            type: RelatedFileType.TO_MODIFY,
            description: 'File to modify',
            lineStart: 10,
            lineEnd: 20
          }
        ],
        implementationGuide: 'New implementation steps',
        verificationCriteria: 'New verification steps'
      };

      // Minimal valid data, only taskId is required
      const minimalValidData = {
        taskId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'New task name'
      };

      const invalidDataList = [
        { 
          data: { name: 'New name' }, 
          error: 'required' 
        },
        { 
          data: { taskId: 'not-a-uuid' }, 
          error: 'Invalid uuid' 
        },
        { 
          data: { 
            taskId: '123e4567-e89b-12d3-a456-426614174000',
            relatedFiles: [
              { type: RelatedFileType.TO_MODIFY, description: 'File description' }
            ]
          }, 
          error: 'required' 
        },
        { 
          data: { 
            taskId: '123e4567-e89b-12d3-a456-426614174000',
            relatedFiles: [
              { path: 'src/file.js', description: 'File description' }
            ]
          }, 
          error: 'required' 
        }
      ];

      testSchemaValidation(updateTaskContentSchema, validData, invalidDataList);
      expect(() => updateTaskContentSchema.parse(minimalValidData)).not.toThrow();
    });
  });

  describe('queryTaskSchema validation', () => {
    test('should validate queryTaskSchema correctly', () => {
      const validData = {
        query: 'search query',
        isId: true,
        page: 2,
        pageSize: 10
      };

      // Minimal valid data with only required fields
      const minimalValidData = {
        query: 'search query'
      };

      const invalidDataList = [
        { 
          data: { isId: true }, 
          error: 'required' 
        },
        { 
          data: { query: '' }, 
          error: 'String must contain at least 1 character' 
        },
        { 
          data: { query: 'search query', isId: 'not-a-boolean' }, 
          error: 'Expected boolean' 
        },
        { 
          data: { query: 'search query', page: 'not-a-number' }, 
          error: 'Expected number' 
        },
        { 
          data: { query: 'search query', page: -1 }, 
          error: 'Number must be greater than 0' 
        },
        { 
          data: { query: 'search query', pageSize: 0 }, 
          error: 'Number must be greater than or equal to 1' 
        },
        { 
          data: { query: 'search query', pageSize: 21 }, 
          error: 'Number must be less than or equal to 20' 
        }
      ];

      testSchemaValidation(queryTaskSchema, validData, invalidDataList);
      expect(() => queryTaskSchema.parse(minimalValidData)).not.toThrow();

      // Test default values
      const parsed = queryTaskSchema.parse(minimalValidData);
      expect(parsed.isId).toBe(false);
      expect(parsed.page).toBe(1);
      expect(parsed.pageSize).toBe(5);
    });
  });

  describe('getTaskDetailSchema validation', () => {
    test('should validate getTaskDetailSchema correctly', () => {
      const validData = {
        taskId: '123e4567-e89b-12d3-a456-426614174000'
      };

      const invalidDataList = [
        { 
          data: {}, 
          error: 'required' 
        },
        { 
          data: { taskId: '' }, 
          error: 'String must contain at least 1 character' 
        }
      ];

      testSchemaValidation(getTaskDetailSchema, validData, invalidDataList);
    });
  });
}); 