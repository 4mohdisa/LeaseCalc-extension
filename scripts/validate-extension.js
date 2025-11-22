import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

function validateExtension() {
  console.log('🔍 Validating Chrome Extension...\n');

  let hasErrors = false;
  let hasWarnings = false;

  // Check if dist exists
  if (!fs.existsSync(distDir)) {
    console.error('❌ CRITICAL: dist directory not found');
    console.error('   Run: npm run build:extension\n');
    return false;
  }

  // Validate manifest.json
  console.log('📋 Checking manifest.json...');
  const manifestPath = path.join(distDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ CRITICAL: manifest.json not found');
    hasErrors = true;
  } else {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      // Check required fields
      if (!manifest.manifest_version) {
        console.error('❌ ERROR: manifest_version missing');
        hasErrors = true;
      } else if (manifest.manifest_version !== 3) {
        console.warn('⚠️  WARNING: manifest_version should be 3');
        hasWarnings = true;
      } else {
        console.log('  ✓ manifest_version: 3');
      }

      if (!manifest.name) {
        console.error('❌ ERROR: name missing');
        hasErrors = true;
      } else {
        console.log(`  ✓ name: "${manifest.name}"`);
      }

      if (!manifest.version) {
        console.error('❌ ERROR: version missing');
        hasErrors = true;
      } else {
        console.log(`  ✓ version: ${manifest.version}`);
      }

      if (!manifest.description) {
        console.error('❌ ERROR: description missing');
        hasErrors = true;
      } else if (manifest.description.length < 10) {
        console.warn('⚠️  WARNING: description too short');
        hasWarnings = true;
      } else {
        console.log(`  ✓ description: ${manifest.description.substring(0, 50)}...`);
      }

      // Check icons
      if (!manifest.icons) {
        console.error('❌ ERROR: icons missing');
        hasErrors = true;
      } else {
        const requiredSizes = ['16', '32', '48', '128'];
        requiredSizes.forEach(size => {
          if (!manifest.icons[size]) {
            console.error(`❌ ERROR: icon ${size}x${size} missing in manifest`);
            hasErrors = true;
          } else {
            const iconPath = path.join(distDir, manifest.icons[size]);
            if (!fs.existsSync(iconPath)) {
              console.error(`❌ ERROR: icon file not found: ${manifest.icons[size]}`);
              hasErrors = true;
            } else {
              console.log(`  ✓ icon ${size}x${size}: ${manifest.icons[size]}`);
            }
          }
        });
      }

      // Check for problematic permissions
      if (manifest.permissions && manifest.permissions.length > 0) {
        console.warn('⚠️  WARNING: Extension has permissions:', manifest.permissions);
        console.warn('   Consider if all permissions are necessary');
        hasWarnings = true;
      } else {
        console.log('  ✓ No permissions requested');
      }

      if (manifest.host_permissions) {
        console.error('❌ ERROR: host_permissions found - should be removed for popup-only extension');
        console.error('   Found:', manifest.host_permissions);
        hasErrors = true;
      } else {
        console.log('  ✓ No host_permissions');
      }

      if (manifest.content_scripts) {
        console.error('❌ ERROR: content_scripts found - should be removed for popup-only extension');
        hasErrors = true;
      } else {
        console.log('  ✓ No content_scripts');
      }

      // Check action
      if (!manifest.action) {
        console.error('❌ ERROR: action missing');
        hasErrors = true;
      } else {
        if (!manifest.action.default_popup) {
          console.error('❌ ERROR: action.default_popup missing');
          hasErrors = true;
        } else {
          console.log(`  ✓ default_popup: ${manifest.action.default_popup}`);
        }
      }

    } catch (error) {
      console.error('❌ ERROR: Invalid JSON in manifest.json');
      console.error('  ', error.message);
      hasErrors = true;
    }
  }

  // Check required files
  console.log('\n📁 Checking required files...');
  const requiredFiles = [
    'index.html',
    'index.js',
    'index.css'
  ];

  requiredFiles.forEach(file => {
    const filePath = path.join(distDir, file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ ERROR: ${file} not found`);
      hasErrors = true;
    } else {
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`  ✓ ${file} (${sizeKB} KB)`);
    }
  });

  // Check total size
  console.log('\n📊 Checking package size...');
  let totalSize = 0;
  function calculateDirSize(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        calculateDirSize(filePath);
      } else {
        totalSize += stats.size;
      }
    });
  }
  calculateDirSize(distDir);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log(`  Total size: ${totalSizeMB} MB`);
  
  if (totalSize > 100 * 1024 * 1024) {
    console.error('❌ ERROR: Package size exceeds 100 MB limit');
    hasErrors = true;
  } else if (totalSize > 50 * 1024 * 1024) {
    console.warn('⚠️  WARNING: Package size is large (>50 MB)');
    hasWarnings = true;
  } else {
    console.log('  ✓ Size is acceptable');
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (hasErrors) {
    console.log('❌ VALIDATION FAILED - Please fix errors above');
    return false;
  } else if (hasWarnings) {
    console.log('⚠️  VALIDATION PASSED WITH WARNINGS');
    console.log('   Review warnings before submitting');
    return true;
  } else {
    console.log('✅ VALIDATION PASSED - Extension is ready for submission!');
    console.log('\n📝 Next step: Run "npm run package" to create the ZIP file');
    return true;
  }
}

const isValid = validateExtension();
process.exit(isValid ? 0 : 1);
