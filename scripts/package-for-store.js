import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const zipFile = path.join(rootDir, 'lease-calculator-extension.zip');

async function packageExtension() {
  console.log('📦 Packaging extension for Chrome Web Store...\n');

  // Check if dist directory exists
  if (!fs.existsSync(distDir)) {
    console.error('❌ Error: dist directory not found. Run "npm run build:extension" first.');
    process.exit(1);
  }

  // Verify required files
  const requiredFiles = [
    'manifest.json',
    'index.html',
    'index.js',
    'index.css',
    'icons/icon16.png',
    'icons/icon32.png',
    'icons/icon48.png',
    'icons/icon128.png'
  ];

  console.log('✓ Checking required files...');
  let allFilesExist = true;
  for (const file of requiredFiles) {
    const filePath = path.join(distDir, file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Missing: ${file}`);
      allFilesExist = false;
    } else {
      console.log(`  ✓ ${file}`);
    }
  }

  if (!allFilesExist) {
    console.error('\n❌ Some required files are missing. Please fix and try again.');
    process.exit(1);
  }

  // Remove old zip if exists
  if (fs.existsSync(zipFile)) {
    fs.unlinkSync(zipFile);
    console.log('\n✓ Removed old zip file');
  }

  // Create zip file
  console.log('\n📦 Creating ZIP file...');
  try {
    // Use PowerShell on Windows
    const command = `powershell Compress-Archive -Path "${distDir}\\*" -DestinationPath "${zipFile}" -Force`;
    await execAsync(command);
    console.log('✓ ZIP file created successfully!');
  } catch (error) {
    console.error('❌ Error creating ZIP file:', error.message);
    process.exit(1);
  }

  // Get file size
  const stats = fs.statSync(zipFile);
  const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log('\n✅ Package ready for Chrome Web Store!');
  console.log(`📁 File: ${zipFile}`);
  console.log(`📊 Size: ${fileSizeInMB} MB`);
  console.log('\n📝 Next steps:');
  console.log('1. Go to https://chrome.google.com/webstore/devcenter/dashboard');
  console.log('2. Click "New Item"');
  console.log('3. Upload lease-calculator-extension.zip');
  console.log('4. Fill in store listing details (see CHROME_STORE_SUBMISSION.md)');
  console.log('5. Submit for review\n');
}

packageExtension().catch(console.error);
