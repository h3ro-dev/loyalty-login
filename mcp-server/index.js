const express = require('express');
const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// The repository URL (read-only). Set REPO_URL env var or use default placeholder.
const repoUrl = process.env.REPO_URL || 'https://github.com/promaxdigital/portal-smart-contracts.git';
// Directory where the repository will be cloned
const cloneDir = path.join(__dirname, 'smartcontracts');

const git = simpleGit();

async function cloneOrUpdateRepo() {
  if (!fs.existsSync(cloneDir)) {
    console.log('Cloning repository into', cloneDir);
    await git.clone(repoUrl, cloneDir);
  } else {
    console.log('Repository already cloned. Pulling latest changes...');
    await git.cwd(cloneDir);
    await git.pull();
  }
}

// Endpoint to list all files in the repository
app.get('/files', (req, res) => {
  if (!fs.existsSync(cloneDir)) {
    return res.status(500).json({ error: 'Repository not cloned yet' });
  }
  
  // Recursively walk the directory to list files
  function walk(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath, fileList);
      } else {
        fileList.push(path.relative(cloneDir, fullPath));
      }
    });
    return fileList;
  }
  
  const files = walk(cloneDir);
  res.json({ files });
});

// Endpoint to get the content of a given file
app.get('/files/*', (req, res) => {
  // req.params[0] contains the wildcard match
  const filePath = req.params[0];
  const fullPath = path.join(cloneDir, filePath);
  if (fs.existsSync(fullPath)) {
    res.sendFile(fullPath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Start server and clone/update repository
app.listen(PORT, async () => {
  try {
    await cloneOrUpdateRepo();
  } catch (err) {
    console.error('Error cloning/updating repository:', err);
  }
  console.log(`MCP server running on port ${PORT}`);
}); 