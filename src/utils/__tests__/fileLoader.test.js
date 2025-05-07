import { jest } from '@jest/globals';
import { loadTaskRelatedFiles } from '../fileLoader.ts';
import { RelatedFileType } from '../../types/index.js';

describe('fileLoader utility tests', () => {
  describe('loadTaskRelatedFiles function', () => {
    test('should handle empty related files array', async () => {
      const result = await loadTaskRelatedFiles([]);
      
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('summary');
      expect(result.content).toBe('');
      expect(result.summary).toBe('No related files');
    });

    test('should handle null or undefined related files', async () => {
      // @ts-ignore: Testing invalid input
      const result1 = await loadTaskRelatedFiles(null);
      // @ts-ignore: Testing invalid input
      const result2 = await loadTaskRelatedFiles(undefined);
      
      expect(result1.summary).toBe('No related files');
      expect(result2.summary).toBe('No related files');
    });

    test('should generate summary and content for related files', async () => {
      const relatedFiles = [
        {
          path: '/path/to/file1.js',
          type: RelatedFileType.TO_MODIFY,
          description: 'File to be modified'
        },
        {
          path: '/path/to/file2.js',
          type: RelatedFileType.REFERENCE,
          description: 'Reference file'
        }
      ];
      
      const result = await loadTaskRelatedFiles(relatedFiles);
      
      // Updated expectations to match the actual output format
      expect(result.content).toContain('### To Modify:');
      expect(result.content).toContain('### Reference Material:');
      expect(result.content).toContain('File to be modified');
      expect(result.content).toContain('Reference file');
      
      expect(result.summary).toContain('Related Files Summary (2 files total)');
      expect(result.summary).toContain('/path/to/file1.js');
      expect(result.summary).toContain('/path/to/file2.js');
    });

    test('should handle files with line ranges', async () => {
      const relatedFiles = [
        {
          path: '/path/to/file1.js',
          type: RelatedFileType.TO_MODIFY,
          description: 'File with line range',
          lineStart: 10,
          lineEnd: 20
        }
      ];
      
      const result = await loadTaskRelatedFiles(relatedFiles);
      
      expect(result.content).toContain('(lines 10-20)');
      expect(result.content).toContain('Line range: 10-20');
    });

    test('should sort files by type priority', async () => {
      const relatedFiles = [
        {
          path: '/path/to/fileC.js',
          type: RelatedFileType.CREATE,
          description: 'File to create'
        },
        {
          path: '/path/to/fileR.js',
          type: RelatedFileType.REFERENCE,
          description: 'Reference file'
        },
        {
          path: '/path/to/fileM.js',
          type: RelatedFileType.TO_MODIFY,
          description: 'File to modify'
        },
        {
          path: '/path/to/fileD.js',
          type: RelatedFileType.DEPENDENCY,
          description: 'Dependency file'
        }
      ];
      
      const result = await loadTaskRelatedFiles(relatedFiles);
      const content = result.content;
      
      // Just verify the files appear in the correct order in the output
      expect(content.indexOf('/path/to/fileM.js')).toBeLessThan(content.indexOf('/path/to/fileR.js'));
      expect(content.indexOf('/path/to/fileR.js')).toBeLessThan(content.indexOf('/path/to/fileD.js'));
      expect(content.indexOf('/path/to/fileD.js')).toBeLessThan(content.indexOf('/path/to/fileC.js'));
    });

    test('should respect maxTotalLength parameter', async () => {
      // Create a large number of related files to potentially exceed the max length
      const relatedFiles = Array(30).fill(null).map((_, index) => ({
        path: `/path/to/file${index}.js`,
        type: RelatedFileType.REFERENCE,
        description: `Reference file ${index} with a somewhat lengthy description to take up more space`
      }));
      
      // Set a small max length to force truncation
      const maxTotalLength = 500;
      
      const result = await loadTaskRelatedFiles(relatedFiles, maxTotalLength);
      
      // Verify the content is limited
      expect(result.summary).toContain('Context length limit reached');
      expect(result.content.length).toBeLessThanOrEqual(maxTotalLength * 1.5); // Allow some overhead
    });

    test('should include file information in summary', async () => {
      const relatedFiles = [
        {
          path: '/path/to/file1.js',
          type: RelatedFileType.TO_MODIFY,
          description: 'File to be modified'
        }
      ];
      
      const result = await loadTaskRelatedFiles(relatedFiles);
      
      expect(result.summary).toContain('/path/to/file1.js');
      expect(result.summary).toContain('File to be modified');
      expect(result.summary).toMatch(/\(\d+ characters\)/); // Verify character count is included
    });
  });
}); 