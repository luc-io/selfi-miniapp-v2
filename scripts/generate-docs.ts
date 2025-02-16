import fs from 'fs';
import path from 'path';
import ts from 'typescript';

interface DocItem {
  path: string;
  exports: string[];
  imports: string[];
  description: string;
  typeDefinitions?: string[];
}

function extractFileDescription(sourceFile: ts.SourceFile | undefined): string {
  if (!sourceFile) return '';
  
  const firstComment = sourceFile.statements.find(node => {
    const trivia = ts.getLeadingCommentRanges(sourceFile.text, node.pos);
    return trivia && trivia.length > 0;
  });

  if (firstComment) {
    const trivia = ts.getLeadingCommentRanges(sourceFile.text, firstComment.pos);
    if (trivia && trivia.length > 0) {
      return sourceFile.text.slice(trivia[0].pos, trivia[0].end);
    }
  }

  return '';
}

function generateTypeScriptDocs(filePath: string): DocItem {
  const program = ts.createProgram([filePath], {});
  const sourceFile = program.getSourceFile(filePath);
  const typeChecker = program.getTypeChecker();

  const exports: string[] = [];
  const imports: string[] = [];
  const typeDefinitions: string[] = [];

  if (sourceFile) {
    ts.forEachChild(sourceFile, node => {
      if (ts.isExportDeclaration(node)) {
        exports.push(node.getText());
      }
      if (ts.isImportDeclaration(node)) {
        imports.push(node.getText());
      }
      if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
        typeDefinitions.push(node.getText());
      }
    });
  }

  return {
    path: filePath,
    exports,
    imports,
    typeDefinitions,
    description: extractFileDescription(sourceFile)
  };
}

function walkDirectory(dir: string): DocItem[] {
  const items: DocItem[] = [];
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      items.push(...walkDirectory(fullPath));
    } else if (path.extname(file) === '.ts' || path.extname(file) === '.tsx') {
      items.push(generateTypeScriptDocs(fullPath));
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

// Generate documentation
const docs = walkDirectory('./src');

// Save documentation
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'project-docs.json'),
  JSON.stringify(docs, null, 2)
);

// Generate context index
const contextIndex = docs.reduce((acc, doc) => {
  // Create searchable index based on file content
  const context = {
    path: doc.path,
    types: doc.typeDefinitions || [],
    exports: doc.exports,
    imports: doc.imports
  };

  const category = path.dirname(doc.path).split(path.sep)[1] || 'root';
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(context);
  return acc;
}, {} as Record<string, any[]>);

// Save context index
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'context-index.json'),
  JSON.stringify(contextIndex, null, 2)
);
