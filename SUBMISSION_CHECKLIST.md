# Chrome Web Store Submission Checklist

## Pre-Submission ✅

- [x] Code changes complete (letting fee input added)
- [x] Manifest.json cleaned up (no unnecessary permissions)
- [x] Icons properly configured (16, 32, 48, 128)
- [x] Extension built successfully
- [x] Validation passed
- [x] ZIP file created (lease-calculator-extension.zip)

## Before Uploading

- [ ] Test extension locally in Chrome
  - [ ] Load unpacked from `dist` folder
  - [ ] Test Rent Calculator
  - [ ] Test Advertising Fee Calculator  
  - [ ] Test Reletting Fee Calculator with new letting fee input
  - [ ] Test date calculations
  - [ ] Test data persistence (close/reopen popup)
  - [ ] Check for console errors

- [ ] Prepare screenshots (at least 1, recommended 3)
  - [ ] Screenshot 1: Rent Calculator in action
  - [ ] Screenshot 2: Advertising Fee Calculator
  - [ ] Screenshot 3: Reletting Fee Calculator showing letting fee input
  - Size: 1280x800 or 640x400 pixels

- [ ] Prepare promotional images (optional but recommended)
  - [ ] Small tile: 440x280
  - [ ] Marquee: 1400x560

## Chrome Web Store Account

- [ ] Have a Chrome Web Store developer account
  - If not, register at: https://chrome.google.com/webstore/devcenter/
  - One-time $5 registration fee required

## Upload Process

1. [ ] Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devcenter/dashboard)
2. [ ] Click "New Item"
3. [ ] Upload `lease-calculator-extension.zip`
4. [ ] Wait for upload to complete

## Store Listing Information

### Basic Info
- [ ] **Name:** Lease Calculator
- [ ] **Summary:** Property management calculator for Australian property managers
- [ ] **Description:** (Copy from CHROME_STORE_SUBMISSION.md)
- [ ] **Category:** Productivity
- [ ] **Language:** English

### Graphics
- [ ] Upload icon (128x128) - already in ZIP
- [ ] Upload at least 1 screenshot
- [ ] Upload promotional images (optional)

### Privacy
- [ ] **Single Purpose:** Property lease calculations
- [ ] **Permissions Justification:** None required (leave empty)
- [ ] **Data Usage:** 
  - [ ] Check "This item does not collect user data"
  - [ ] Or specify: "Data stored locally in browser only, no external transmission"

### Distribution
- [ ] **Visibility:** Public (or Unlisted for testing)
- [ ] **Regions:** All regions (or select specific countries)
- [ ] **Pricing:** Free

## Review Submission

- [ ] Review all information for accuracy
- [ ] Check preview of store listing
- [ ] Agree to terms and policies
- [ ] Click "Submit for Review"

## Post-Submission

- [ ] Note submission date: _______________
- [ ] Expected review time: 1-3 business days
- [ ] Check email for review status updates
- [ ] Monitor developer dashboard for status

## If Rejected

- [ ] Read rejection reason carefully
- [ ] Make necessary changes
- [ ] Run validation again: `npm run validate`
- [ ] Rebuild and repackage: `npm run package`
- [ ] Resubmit

## After Approval

- [ ] Extension is live on Chrome Web Store
- [ ] Share store link with users
- [ ] Monitor reviews and ratings
- [ ] Respond to user feedback

## Store Link Format
After approval, your extension will be available at:
```
https://chrome.google.com/webstore/detail/[extension-id]
```

## Support Resources

- [Chrome Web Store Developer Documentation](https://developer.chrome.com/docs/webstore/)
- [Extension Quality Guidelines](https://developer.chrome.com/docs/webstore/program-policies/)
- [Common Rejection Reasons](https://developer.chrome.com/docs/webstore/troubleshooting/)

## Quick Commands Reference

```bash
# Build extension
npm run build:extension

# Validate extension
npm run validate

# Create ZIP for upload
npm run package

# Development mode
npm run dev
```

## Notes

- Keep this checklist for future updates
- Version updates require same process
- Each update goes through review again
- Keep ZIP file for your records

---

**Current Version:** 1.0.3  
**Package File:** lease-calculator-extension.zip  
**Package Size:** 0.06 MB  
**Status:** Ready for submission ✅
