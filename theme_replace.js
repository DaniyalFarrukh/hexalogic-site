const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /#4F46E5/gi, to: '#ff8947' },
  { from: /#6366F1/gi, to: '#FF7324' },
  { from: /99,102,241/g, to: '255,115,36' }
];

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = walkDir(path.join(__dirname, 'src'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  for (const rep of replacements) {
    if (content.match(rep.from)) {
      content = content.replace(rep.from, rep.to);
      changed = true;
    }
  }
  
  if (changed) {
    console.log('Updated:', file);
    fs.writeFileSync(file, content, 'utf8');
  }
}
console.log('Done replacing theme colors!');
