import fs from 'fs';
import path from 'path';

interface FileInfo {
  path: string;
  content?: string;
  type: 'file' | 'directory';
  description?: string;
}

function generateProjectMap(dir: string): FileInfo[] {
  const items: FileInfo[] = [];
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      items.push({
        path: fullPath,
        type: 'directory',
        description: `Directory containing ${file} related functionality`
      });
      items.push(...generateProjectMap(fullPath));
    } else {
      // Read first few lines of file for context
      const content = fs.readFileSync(fullPath, 'utf-8');
      const firstLines = content.split('\n').slice(0, 5).join('\n');
      
      items.push({
        path: fullPath,
        type: 'file',
        content: firstLines, // First few lines for context
        description: `${path.extname(file)} file in ${path.dirname(fullPath)}`
      });
    }
  });

  return items;
}

// Define output directory
const OUTPUT_DIR = path.join(__dirname, '../docs');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Generate and save project map
const projectMap = generateProjectMap('./src');
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'project-map.json'),
  JSON.stringify(projectMap, null, 2)
);

// Generate markdown structure
function generateMarkdownStructure(items: FileInfo[], level: number = 0): string {
  let markdown = '';
  const indent = '  '.repeat(level);

  items.forEach(item => {
    const icon = item.type === 'directory' ? '📂' : '📜';
    markdown += `${indent}${icon} ${path.basename(item.path)}\n`;
    if (item.description) {
      markdown += `${indent}  ${item.description}\n`;
    }
    if (item.type === 'directory') {
      const subItems = items.filter(subItem => 
        subItem.path.startsWith(item.path + path.sep) &&
        subItem.path.split(path.sep).length === item.path.split(path.sep).length + 1
      );
      markdown += generateMarkdownStructure(subItems, level + 1);
    }
  });

  return markdown;
}

// Save markdown structure
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'project-structure.md'),
  '# Project Structure\n\n' + generateMarkdownStructure(projectMap)
);
