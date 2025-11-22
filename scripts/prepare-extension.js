import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

// Helper function to ensure directory exists
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Helper function to copy file
function copyFile(src, dest) {
  try {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${src} to ${dest}`);
  } catch (err) {
    console.error(`Error copying file from ${src} to ${dest}:`, err);
    throw err;
  }
}

// Helper function to copy directory recursively
function copyDirectory(src, dest) {
  ensureDirectoryExists(dest);
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

// Copy manifest.json
copyFile(
  path.join(rootDir, 'manifest.json'),
  path.join(distDir, 'manifest.json')
);

// Copy icons directory
const iconsSourceDir = path.join(rootDir, 'icons');
const iconsDestDir = path.join(distDir, 'icons');
if (fs.existsSync(iconsSourceDir)) {
  copyDirectory(iconsSourceDir, iconsDestDir);
}

// Copy public directory (icons)
const publicDir = path.join(rootDir, 'public');
if (fs.existsSync(publicDir)) {
  const entries = fs.readdirSync(publicDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(publicDir, entry.name);
    const destPath = path.join(distDir, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

console.log('Extension files prepared in dist directory');
