# Chrome Web Store Submission Guide

## Pre-Submission Checklist

### 1. Build the Extension
```bash
npm run build:extension
```

This will create a production-ready extension in the `dist` directory.

### 2. Required Files in `dist` Directory
- ✅ manifest.json
- ✅ index.html
- ✅ index.js
- ✅ index.css
- ✅ icons/ (with icon16.png, icon32.png, icon48.png, icon128.png)

### 3. Test the Extension Locally
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `dist` directory
5. Test all three calculators:
   - Rent Calculator
   - Advertising Fee Calculator
   - Reletting Fee Calculator

### 4. Create ZIP for Upload
After building, create a ZIP file of the `dist` directory contents:
```bash
# Windows PowerShell
Compress-Archive -Path dist\* -DestinationPath lease-calculator-extension.zip -Force
```

### 5. Chrome Web Store Requirements

#### Store Listing Information
- **Name:** Lease Calculator
- **Summary:** Property management calculator for Australian property managers
- **Description:** 
```
Lease Calculator is a comprehensive tool designed for Australian property managers to quickly calculate:

• Rent & Bond: Calculate move-in costs including 2 weeks advance rent and bond amounts (4 or 6 weeks based on rent amount)

• Advertising Fees: Calculate advertising fees when tenants break leases early, based on remaining term and agreed lease duration

• Reletting Fees: Calculate maximum reletting fees with configurable letting fee weeks (up to 2 weeks), including GST calculations

Features:
- Australian currency (AUD) formatting
- Date-based or manual week entry
- Smart week calculations with rounding
- Persistent data storage
- Clean, intuitive interface
- No data collection or external connections

Perfect for property managers, real estate agents, and landlords managing residential properties in Australia.
```

- **Category:** Productivity
- **Language:** English

#### Privacy
- **Single Purpose:** Property lease calculations
- **Permissions:** None required (popup only)
- **Data Collection:** None - all data stored locally in browser

#### Screenshots Required
- At least 1 screenshot (1280x800 or 640x400)
- Show all three calculator tabs in action

#### Icons Required
- 128x128px icon (main store listing icon) ✅

### 6. Common Rejection Reasons (Now Fixed)

✅ **Fixed: Unnecessary Permissions**
- Removed `host_permissions: ["<all_urls>"]`
- Removed unused `content_scripts`
- Removed `web_accessible_resources`

✅ **Fixed: Missing 128x128 Icon**
- Added icon128.png reference in manifest

✅ **Fixed: Unclear Purpose**
- Updated name to "Lease Calculator"
- Improved description to be specific about functionality

### 7. Upload Process
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devcenter/dashboard)
2. Click "New Item"
3. Upload `lease-calculator-extension.zip`
4. Fill in store listing details
5. Upload screenshots
6. Submit for review

### 8. Review Timeline
- Initial review: 1-3 business days
- If changes requested: Address and resubmit

## Troubleshooting

### Error: "Manifest file is invalid"
- Ensure manifest.json is valid JSON
- Check all icon files exist in the dist/icons directory

### Error: "Package is invalid"
- Make sure you're zipping the contents of `dist`, not the `dist` folder itself
- ZIP should contain: manifest.json, index.html, index.js, index.css, icons/

### Error: "Permissions too broad"
- This has been fixed - manifest now only requests popup permission

### Error: "Single purpose violation"
- Extension now has clear single purpose: property lease calculations
