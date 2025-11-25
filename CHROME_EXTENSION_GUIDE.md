# Chrome Extension Development Guide

A comprehensive guide for building modern Chrome extensions with React, TypeScript, and Vite.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Essential Files](#essential-files)
3. [Manifest V3 Essentials](#manifest-v3-essentials)
4. [Development Workflow](#development-workflow)
5. [Build Scripts](#build-scripts)
6. [Best Practices](#best-practices)
7. [Common Pitfalls](#common-pitfalls)
8. [Chrome Web Store Submission](#chrome-web-store-submission)

---

## Project Structure

```
chrome-extension/
├── public/
│   └── icons/
│       ├── icon16.png
│       ├── icon32.png
│       ├── icon48.png
│       └── icon128.png
├── src/
│   ├── components/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── scripts/
│   ├── prepare-extension.js
│   ├── validate-extension.js
│   └── package-for-store.js
├── dist/ (generated)
├── manifest.json
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Essential Files

### 1. manifest.json (Most Critical File)

```json
{
  "manifest_version": 3,
  "name": "Your Extension Name",
  "version": "1.0.0",
  "description": "Clear description (max 132 chars)",
  "icons": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "action": {
    "default_popup": "index.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png"
    }
  },
  "permissions": [],
  "host_permissions": []
}
```

**Key Fields:**
- `manifest_version`: Must be 3
- `name`: Max 45 characters
- `version`: Semantic versioning (1.0.0)
- `icons`: Required sizes: 16, 32, 48, 128
- `permissions`: Only request what you need
- `host_permissions`: URL patterns for access

### 2. package.json

```json
{
  "name": "your-extension",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:extension": "npm run build && node scripts/prepare-extension.js",
    "validate": "node scripts/validate-extension.js",
    "package": "npm run build:extension && npm run validate && node scripts/package-for-store.js"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/chrome": "^0.0.254",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

### 3. vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.css') return 'index.css'
          return 'assets/[name].[ext]'
        }
      }
    }
  }
})
```

**Important:** No hashed filenames - extensions need predictable paths.

---

## Manifest V3 Essentials

### What Changed from V2?

1. **Service Workers** replace background pages
2. **host_permissions** separated from permissions
3. **Stricter CSP** - no inline scripts or eval()
4. **Promises** instead of callbacks

### Common Permissions

```json
{
  "permissions": [
    "storage",        // chrome.storage API
    "tabs",           // Access tabs
    "activeTab",      // Current tab only
    "scripting",      // Inject scripts
    "contextMenus",   // Context menus
    "notifications"   // Show notifications
  ],
  "host_permissions": [
    "https://*.example.com/*"  // Specific domains
  ]
}
```

⚠️ **Only request permissions you actually use!**

---

## Development Workflow

### Initial Setup

```bash
# Install dependencies
npm install

# Build extension
npm run build:extension

# Load in Chrome
# 1. Go to chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the dist/ folder
```

### Development Cycle

```bash
# Make changes to src/
npm run build:extension

# Reload extension in Chrome
# Click refresh icon on extension card
```

### Testing

```bash
# Validate before submission
npm run validate

# Create production ZIP
npm run package
```

---

## Build Scripts

### prepare-extension.js

Copies manifest.json and icons to dist/:

```javascript
import fs from 'fs'
import path from 'path'

const distDir = './dist'
const iconsDir = path.join(distDir, 'icons')

// Copy manifest
fs.copyFileSync('manifest.json', path.join(distDir, 'manifest.json'))

// Copy icons
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

['16', '32', '48', '128'].forEach(size => {
  const icon = `icon${size}.png`
  fs.copyFileSync(
    path.join('public/icons', icon),
    path.join(iconsDir, icon)
  )
})

console.log('✓ Extension prepared')
```

### validate-extension.js

Checks manifest, files, and size:

```javascript
import fs from 'fs'
import path from 'path'

const distDir = './dist'
const manifest = JSON.parse(
  fs.readFileSync(path.join(distDir, 'manifest.json'))
)

console.log('🔍 Validating...')

// Check manifest
console.log(`✓ Name: ${manifest.name}`)
console.log(`✓ Version: ${manifest.version}`)

// Check required files
['index.html', 'index.js', 'index.css'].forEach(file => {
  if (!fs.existsSync(path.join(distDir, file))) {
    console.error(`❌ Missing: ${file}`)
    process.exit(1)
  }
  console.log(`✓ ${file}`)
})

// Check icons
Object.values(manifest.icons).forEach(iconPath => {
  if (!fs.existsSync(path.join(distDir, iconPath))) {
    console.error(`❌ Missing icon: ${iconPath}`)
    process.exit(1)
  }
  console.log(`✓ ${iconPath}`)
})

console.log('\n✅ Validation passed!')
```

### package-for-store.js

Creates ZIP file for Chrome Web Store:

```javascript
import fs from 'fs'
import archiver from 'archiver'

const manifest = JSON.parse(fs.readFileSync('./dist/manifest.json'))
const zipName = `${manifest.name.toLowerCase().replace(/\s+/g, '-')}.zip`

const output = fs.createWriteStream(zipName)
const archive = archiver('zip', { zlib: { level: 9 } })

archive.pipe(output)
archive.directory('./dist', false)
archive.finalize()

output.on('close', () => {
  const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2)
  console.log(`✅ Created ${zipName} (${sizeMB} MB)`)
})
```

Install archiver: `npm install -D archiver`

---

## Best Practices

### 1. Popup UI Design

**Size Guidelines:**
- Width: 300-400px
- Height: Auto (max 600px)
- Add padding and scrolling

```typescript
function App() {
  return (
    <div style={{ 
      width: '350px',
      maxHeight: '600px',
      padding: '16px',
      overflow: 'auto'
    }}>
      {/* Content */}
    </div>
  )
}
```

### 2. State Persistence

Use Chrome Storage API:

```typescript
// Save data
await chrome.storage.local.set({ key: 'value' })

// Load data
const result = await chrome.storage.local.get(['key'])
console.log(result.key)

// React hook
function useStorageState(key: string, defaultValue: any) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    chrome.storage.local.get([key], (result) => {
      if (result[key] !== undefined) setValue(result[key])
    })
  }, [key])

  const setStorageValue = (newValue: any) => {
    setValue(newValue)
    chrome.storage.local.set({ [key]: newValue })
  }

  return [value, setStorageValue]
}
```

### 3. Icon Requirements

**Required Sizes:**
- 16x16: Favicon
- 32x32: Windows
- 48x48: Extension management
- 128x128: Web Store

**Format:** PNG with transparency

**Tips:**
- Simple, recognizable design
- Test at small sizes
- Consistent branding

### 4. Performance

**Minimize Bundle:**
- Use lightweight libraries
- Remove console.logs in production
- Tree-shake unused code

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true }
    }
  }
})
```

### 5. Error Handling

```typescript
const safeChromeStorage = {
  get: async (keys: string[]) => {
    try {
      return await chrome.storage.local.get(keys)
    } catch (error) {
      console.error('Storage error:', error)
      return {}
    }
  }
}
```

### 6. Content Security Policy

❌ **Don't:**
```html
<script>console.log('inline')</script>
<button onclick="handler()">Click</button>
```

✅ **Do:**
```typescript
<button onClick={handler}>Click</button>
```

---

## Common Pitfalls

### 1. Popup Closes on Click Outside

**Expected behavior.** Use `chrome.storage` to persist state.

### 2. CORS Errors

Add `host_permissions` in manifest:

```json
{
  "host_permissions": ["https://api.example.com/*"]
}
```

### 3. Content Script Not Injecting

Check `content_scripts` and `host_permissions`:

```json
{
  "content_scripts": [{
    "matches": ["https://*.example.com/*"],
    "js": ["content.js"]
  }],
  "host_permissions": ["https://*.example.com/*"]
}
```

### 4. Extension Not Updating

1. Rebuild: `npm run build:extension`
2. Go to `chrome://extensions/`
3. Click refresh icon
4. Hard refresh popup (Ctrl+Shift+R)

### 5. Hashed Filenames

Configure Vite for consistent names:

```typescript
build: {
  rollupOptions: {
    output: {
      entryFileNames: 'index.js',
      assetFileNames: 'index.css'
    }
  }
}
```

---

## Chrome Web Store Submission

### 1. Required Assets

- **Small promo tile:** 440x280 PNG
- **Screenshots:** 1280x800 PNG (1-5 images)
- **Detailed description:** Up to 16,000 chars
- **Privacy policy:** If collecting data

### 2. Store Listing

**Title:** Max 45 chars (match manifest)

**Short Description:** Max 132 chars (match manifest)

**Detailed Description:**
```markdown
# Your Extension Name

Brief overview of what it does.

## Features
- Feature 1
- Feature 2
- Feature 3

## How to Use
1. Step 1
2. Step 2
3. Step 3

## Privacy
This extension does not collect personal data.
All data is stored locally.
```

### 3. Privacy Policy

Required if you collect data. Template:

```markdown
# Privacy Policy

## Data Collection
This extension does not collect or transmit personal data.

## Local Storage
All data is stored locally using Chrome's storage API.

## Contact
Email: your-email@example.com
```

Host on GitHub Pages or your website.

### 4. Submission Steps

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devcenter/dashboard)
2. Pay one-time $5 developer fee (if first extension)
3. Click "New Item"
4. Upload your ZIP file
5. Fill in store listing details
6. Upload screenshots and promo tiles
7. Select category and language
8. Submit for review

### 5. Review Process

- **Initial review:** 1-3 days
- **Updates:** Usually faster
- **Rejections:** Common for permissions issues

**Common rejection reasons:**
- Excessive permissions
- Missing privacy policy
- Poor quality screenshots
- Misleading description

### 6. After Approval

- Extension goes live immediately
- Monitor reviews and ratings
- Respond to user feedback
- Push updates as needed

---

## Quick Reference

### Essential Commands

```bash
npm run build:extension  # Build for testing
npm run validate         # Check before submission
npm run package          # Create ZIP for store
```

### File Checklist

- [ ] manifest.json (version 3)
- [ ] Icons (16, 32, 48, 128)
- [ ] index.html
- [ ] Privacy policy URL
- [ ] Screenshots
- [ ] Promo tiles

### Manifest Checklist

- [ ] manifest_version: 3
- [ ] name (max 45 chars)
- [ ] version (semantic)
- [ ] description (max 132 chars)
- [ ] icons (all sizes)
- [ ] Minimal permissions
- [ ] action.default_popup

### Testing Checklist

- [ ] Loads without errors
- [ ] Popup displays correctly
- [ ] All features work
- [ ] Data persists
- [ ] No console errors
- [ ] Icons display properly
- [ ] Size under 100 MB

---

## Resources

### Official Documentation
- [Chrome Extensions Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/migrating/)
- [Chrome Web Store Policies](https://developer.chrome.com/docs/webstore/program-policies/)

### Tools
- [Extension Manifest Validator](https://webstore.google.com/detail/manifest-validator/)
- [Chrome Extension Source Viewer](https://chromewebstore.google.com/detail/chrome-extension-source-v/jifpbeccnghkjeaalbbjmodiffmgedin)

### Communities
- [r/chrome_extensions](https://reddit.com/r/chrome_extensions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/google-chrome-extension)

---

## Tips from Experience

1. **Start simple** - Get basic popup working first
2. **Test frequently** - Reload extension after every change
3. **Minimal permissions** - Only request what you need
4. **Validate early** - Run validation before submission
5. **Good screenshots** - Show actual functionality
6. **Clear description** - Explain what it does and why
7. **Privacy first** - Be transparent about data usage
8. **Responsive design** - Test at different popup sizes
9. **Error handling** - Wrap Chrome API calls
10. **Version control** - Use Git from the start

---

**Good luck building your Chrome extension! 🚀**
