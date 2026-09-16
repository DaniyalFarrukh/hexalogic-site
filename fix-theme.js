const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content
    .replace(/bg-navy-light/g, 'bg-[#141417]')
    .replace(/bg-navy/g, 'bg-[#0a0a0c]')
    .replace(/hover:bg-teal-dark/g, 'hover:bg-[#ff8947]')
    .replace(/bg-teal/g, 'bg-[#FF7324]')
    .replace(/text-teal/g, 'text-[#FF7324]')
    .replace(/border-teal/g, 'border-[#FF7324]')
    .replace(/ring-teal/g, 'ring-[#FF7324]')
    .replace(/hover:text-teal/g, 'hover:text-[#FF7324]')
    .replace(/hover:border-teal/g, 'hover:border-[#FF7324]')
    .replace(/text-slate/g, 'text-gray-400')
    .replace(/border-slate\/20/g, 'border-white/10')
    .replace(/border-slate\/30/g, 'border-white/10')
    .replace(/border-slate\/10/g, 'border-white/5')
    .replace(/border-slate/g, 'border-white/10')
    .replace(/text-slate/g, 'text-gray-400')
    
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

traverse(path.join(__dirname, 'src/app/portal'));
traverse(path.join(__dirname, 'src/app/admin'));
traverse(path.join(__dirname, 'src/components/portal'));
traverse(path.join(__dirname, 'src/components/admin'));
