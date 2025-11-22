# Quick Start Guide - Slide Editor

Get up and running in 2 minutes!

---

## 🚀 Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# Navigate to: http://localhost:5173
```

---

## ✅ Verify Everything Works

### Run All Tests
```bash
# Unit tests (should show 13/13 passing)
npm test

# Linting (should complete with no errors)
npm run lint

# Build (should complete successfully)
npm run build
```

### Test the App Manually
1. **Create slides**: Click "+ Add Slide" until you have 5 slides
2. **Add elements**: Use toolbar buttons (Big Text, Soft Box, etc.)
3. **Edit elements**: Click to select, drag to move, use properties panel
4. **Test undo/redo**: Press Ctrl+Z and Ctrl+Y
5. **Test persistence**: Refresh the page - your slides should remain

---

## 🎯 Run E2E Tests (Cypress)

```bash
# Terminal 1: Start dev server (keep running)
npm run dev

# Terminal 2: Run Cypress tests
npm run cypress:run

# Or open Cypress UI for interactive testing
npm run cypress:open
```

**Expected**: All 8 E2E tests pass

---

## 📦 Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

Build output in `dist/` folder.

---

## 🎨 Try These Features

### Basic Workflow
1. Click "+ Add Slide" to create a new slide
2. Click "Big Text" to add text
3. Double-click the text to edit it
4. Change colors/fonts in the Properties Panel (right side)
5. Add shapes and images
6. Use Copy/Remove buttons on slide thumbnails

### Keyboard Shortcuts
- **Undo**: Ctrl+Z (or Cmd+Z on Mac)
- **Redo**: Ctrl+Y (or Cmd+Shift+Z on Mac)
- **Delete element**: Select element, press Delete or Backspace

### Advanced Features
- Drag elements to reposition
- Resize using corner handles
- Create up to 5 slides
- Duplicate slides with the Copy button
- Auto-save works automatically (check localStorage in DevTools)

---

## 🐛 Troubleshooting

### Tests Not Running
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Check TypeScript errors
npm run build

# Check linting
npm run lint
```

### Port 5173 Already in Use
```bash
# Kill the process using port 5173
# On Linux/Mac:
lsof -ti:5173 | xargs kill -9

# Or change port in vite.config.ts:
# server: { port: 3000 }
```

---

## 📚 Next Steps

- Read [README.md](./README.md) for complete documentation
- Check [VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md) for testing guide
- Review [TASK_BREAKDOWN.md](./TASK_BREAKDOWN.md) for implementation details

---

## ✨ You're Ready!

The slide editor is fully functional and production-ready. Enjoy creating presentations!

**Status**: ✅ Phase 1 Complete | 🎉 Ready to Use
