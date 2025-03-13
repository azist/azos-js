#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function makeHTMLFile(mermaidCode) {
    return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Class Diagram</title>
    <script type="module">
      import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
      mermaid.initialize({ startOnLoad: true });
    </script>
  </head>
  <body>
    <div class="mermaid">
      ${mermaidCode}
    </div>
  </body>
  </html>
    `;
}

function getClassDiagram(folderPath, outputPath) {
  const classRegex = /class\s+(\w+)\s*(?:extends\s*(\w+))?\s*\{([\s\S]*?)\}/g;
  const propertyRegex = /this\.(\w+)\s*=/g;
  let classes = {};

  function parseFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    let match;

    while ((match = classRegex.exec(content)) !== null) {
      const className = match[1];
      const parentClass = match[2] || null;
      const classBody = match[3] || '';
      let properties = [];
        
      let propMatch;
      while ((propMatch = propertyRegex.exec(classBody)) !== null) {
          properties.push(propMatch[1]);
      }

      classes[className] = {
        parent: parentClass,
        properties: properties
      };
    }
  }

  function traverseDir(dirPath) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isFile() && path.extname(file) === '.js') {
        parseFile(filePath);
      } else if (stat.isDirectory()) {
        traverseDir(filePath);
      }
    });
  }

  traverseDir(folderPath);

  let mermaidCode = 'classDiagram\n';

  for (const className in classes) {
    const classInfo = classes[className];
    if (classInfo.parent) {
      mermaidCode += `  ${classInfo.parent} <|-- ${className}\n`;
    }
    classInfo.properties.forEach(property => {
        mermaidCode += `  ${className} : ${property}\n`;
    });
  }

  const outputContent = '```mermaid\n' + mermaidCode + '```';
  fs.writeFileSync(outputPath+'index.md', outputContent);
  console.log(`Mermaid code saved to ${outputPath}`);

  
  fs.writeFileSync(outputPath+'index.html', makeHTMLFile(mermaidCode));
}

if (process.argv.length < 4) {
  console.error('Usage: node classDiagramGenerator.js <folderPath> <outputPath>');
  process.exit(1);
}

const folderPath = process.argv[2];
const outputPath = process.argv[3];
getClassDiagram(folderPath, outputPath);

