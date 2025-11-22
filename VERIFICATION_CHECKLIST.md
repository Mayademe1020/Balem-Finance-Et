# Slide Editor - Feature Verification Checklist

Use this checklist to systematically verify all implemented features meet the acceptance criteria.

---

## 🧪 Automated Tests

### Unit Tests
```bash
npm test -- --run
```
- [ ] All 13 tests pass in `slideStore.test.ts`
- [ ] No console errors during test run
- [ ] Coverage includes all store actions

**Expected Output**: ✓ 13 passed (13)

---

### Linting
```bash
npm run lint
```
- [ ] No ESLint errors or warnings
- [ ] Code follows TypeScript strict mode

**Expected Output**: No output (success)

---

### Build Verification
```bash
npm run build
```
- [ ] TypeScript compilation succeeds
- [ ] Vite builds without errors
- [ ] `dist/` folder created with assets

**Expected Output**: ✓ built in ~2-3s

---

## 🎯 Manual Feature Testing

### 1. Slide Management (Max 5 Slides)

#### Test 1.1: Add Slides
1. Start app: `npm run dev`
2. Open http://localhost:5173
3. Click "+ Add Slide" button 4 times
4. Verify:
   - [ ] 5 slides total displayed
   - [ ] Counter shows "5 of 5 slides"
   - [ ] Clicking "+ Add Slide" shows alert: "Only five slides for now..."
   - [ ] Each slide has thumbnail preview

#### Test 1.2: Navigate Slides
1. Click on slide 1 thumbnail
2. Click on slide 3 thumbnail
3. Verify:
   - [ ] Active slide highlighted with blue border
   - [ ] Slide number displayed (1-5)
   - [ ] Canvas content changes

#### Test 1.3: Duplicate Slide
1. Add text to slide 1
2. Click "Copy" button on slide 1
3. Verify:
   - [ ] New slide 2 created with same content
   - [ ] Slide counter increases
   - [ ] Original slide unchanged

#### Test 1.4: Delete Slide
1. Create 2 slides
2. Click "Remove" on slide 2
3. Confirm deletion dialog
4. Verify:
   - [ ] Slide deleted
   - [ ] Counter decreases
   - [ ] Cannot delete last slide (alert shown)

---

### 2. Add Elements

#### Test 2.1: Add Text
1. Click "Big Text" toolbar button
2. Verify:
   - [ ] Text box appears on canvas
   - [ ] Default text: "Gentle reminder: type here"
   - [ ] Properties panel shows text controls
   - [ ] Font size: 32px default

#### Test 2.2: Add Rectangle
1. Click "Soft Box" toolbar button
2. Verify:
   - [ ] Rounded rectangle appears
   - [ ] Fill color: yellow (#fde68a)
   - [ ] Stroke: orange
   - [ ] Properties panel shows fill/stroke controls

#### Test 2.3: Add Circle
1. Click "Round Shape" toolbar button
2. Verify:
   - [ ] Circle appears
   - [ ] Fill color: light green
   - [ ] Stroke: green

#### Test 2.4: Add Triangle
1. Click "Triangle" toolbar button
2. Verify:
   - [ ] Triangle appears
   - [ ] Fill color: light red/pink
   - [ ] Stroke: red

#### Test 2.5: Upload Image
1. Click "Photo" toolbar button
2. Select an image file
3. Verify:
   - [ ] Image appears on canvas
   - [ ] Image can be resized
   - [ ] Properties panel shows position controls

---

### 3. Edit Elements

#### Test 3.1: Move Element
1. Add any element
2. Click and drag it
3. Verify:
   - [ ] Element follows cursor
   - [ ] Position updates in properties panel
   - [ ] X/Y values change

#### Test 3.2: Resize Element
1. Select element
2. Drag corner handles
3. Verify:
   - [ ] Element scales
   - [ ] Proportions maintained (or not, depending on handle)

#### Test 3.3: Rotate Element
1. Select element
2. Drag rotation handle (top middle)
3. Verify:
   - [ ] Element rotates
   - [ ] Angle updates

#### Test 3.4: Edit Text Properties
1. Add text element
2. Change font family dropdown
3. Change font size (10-120)
4. Change text color
5. Click alignment buttons
6. Verify:
   - [ ] All changes apply immediately
   - [ ] Text updates on canvas

#### Test 3.5: Edit Shape Properties
1. Add shape element
2. Change fill color
3. Change border color
4. Adjust border width slider (0-12)
5. Verify:
   - [ ] All changes apply immediately
   - [ ] Shape updates on canvas

#### Test 3.6: Double-Click Text Editing
1. Add text element
2. Double-click it on canvas
3. Type new text
4. Verify:
   - [ ] Inline editing works
   - [ ] Cursor visible
   - [ ] Text saves when deselected

---

### 4. Delete Elements

#### Test 4.1: Delete via Button
1. Select element
2. Click "Remove" button in properties panel
3. Verify:
   - [ ] Element removed from canvas
   - [ ] Properties panel shows empty state

#### Test 4.2: Delete via Keyboard
1. Select element
2. Press Delete or Backspace key
3. Verify:
   - [ ] Element removed
   - [ ] Does NOT delete when typing in text field

---

### 5. Undo/Redo

#### Test 5.1: Undo via Button
1. Add 3 elements
2. Click "↶ Undo" button 3 times
3. Verify:
   - [ ] Elements removed in reverse order
   - [ ] Canvas state reverts

#### Test 5.2: Undo via Keyboard
1. Add element
2. Press Ctrl+Z (or Cmd+Z on Mac)
3. Verify:
   - [ ] Last action undone

#### Test 5.3: Redo via Button
1. Undo an action
2. Click "↷ Redo" button
3. Verify:
   - [ ] Action re-applied

#### Test 5.4: Redo via Keyboard
1. Undo an action
2. Press Ctrl+Y (or Cmd+Shift+Z on Mac)
3. Verify:
   - [ ] Action re-applied

---

### 6. Persistence

#### Test 6.1: Auto-save to Local Storage
1. Add elements to slide
2. Wait 2 seconds (autosave delay)
3. Open browser DevTools → Application → Local Storage
4. Verify:
   - [ ] Key "slide-editor-state" exists
   - [ ] Value contains slides array

#### Test 6.2: Reload Persistence
1. Create 3 slides with elements
2. Refresh page (F5 or Ctrl+R)
3. Verify:
   - [ ] All slides restored
   - [ ] Elements restored
   - [ ] Current slide index restored

#### Test 6.3: API Auto-save (Console Check)
1. Open browser DevTools → Console
2. Edit slides
3. Wait 1.5 seconds
4. Verify:
   - [ ] Console shows POST to `/api/slides/draft`
   - [ ] Error logged (expected, endpoint doesn't exist)
   - [ ] No crashes

---

### 7. Accessibility

#### Test 7.1: Keyboard Navigation
1. Press Tab key repeatedly
2. Verify:
   - [ ] Focus moves through interactive elements
   - [ ] Focus visible (outline)
   - [ ] Can activate buttons with Enter/Space

#### Test 7.2: Screen Reader Support
1. Use screen reader (NVDA/JAWS/VoiceOver)
2. Navigate UI
3. Verify:
   - [ ] ARIA labels read correctly
   - [ ] Button purposes clear
   - [ ] Slide numbers announced

#### Test 7.3: Tooltips
1. Hover over toolbar buttons
2. Verify:
   - [ ] Tooltip appears
   - [ ] Text is friendly and clear

---

### 8. Responsive Design

#### Test 8.1: Desktop (1024px+)
1. View at 1920x1080
2. Verify:
   - [ ] 3-column layout (slides | canvas | properties)
   - [ ] All panels visible
   - [ ] No horizontal scroll

#### Test 8.2: Tablet (768px - 1024px)
1. Resize browser to 800px width
2. Verify:
   - [ ] Layout still usable
   - [ ] Panels may wrap

#### Test 8.3: Mobile (< 768px)
1. Resize browser to 375px width
2. Verify:
   - [ ] Vertical stacking
   - [ ] Canvas scales down
   - [ ] All features accessible

---

### 9. User Experience

#### Test 9.1: Grandmother-Friendly Language
1. Review all button text and alerts
2. Verify:
   - [ ] "Big Text" (not "Add Text")
   - [ ] "Soft Box" (not "Rectangle")
   - [ ] "Round Shape" (not "Circle")
   - [ ] "Photo" (not "Image Upload")
   - [ ] Alert: "Only five slides for now, dear..."
   - [ ] Alert: "At least one slide must stay."

#### Test 9.2: Large Touch Targets
1. Inspect button sizes
2. Verify:
   - [ ] Toolbar buttons min 44x44px
   - [ ] "Add Slide" button large
   - [ ] Properties inputs easy to click

#### Test 9.3: Visual Feedback
1. Interact with buttons
2. Verify:
   - [ ] Hover effects present
   - [ ] Active slide highlighted
   - [ ] Selected element has visible handles

---

## 🔧 Cypress E2E Tests

### Run Cypress Tests
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run Cypress
npm run cypress:run
```

#### Cypress Test Suite
- [ ] Test 1: Create 5-slide deck
- [ ] Test 2: Add text to slide
- [ ] Test 3: Add shape to slide
- [ ] Test 4: Add multiple elements
- [ ] Test 5: Duplicate slide
- [ ] Test 6: Save and reload state
- [ ] Test 7: Undo and redo
- [ ] Test 8: Delete element
- [ ] Test 9: Create and navigate multiple slides

**Expected**: All 8 tests pass

---

## ✅ Acceptance Criteria Final Check

- [ ] ✅ User can create/edit up to 5 slides
- [ ] ✅ Support for text elements with styling
- [ ] ✅ Support for shape elements (rect, circle, triangle)
- [ ] ✅ Support for image upload
- [ ] ✅ Drag-drop positioning works
- [ ] ✅ Undo/redo functionality
- [ ] ✅ Autosave to localStorage
- [ ] ✅ Autosave to API endpoint (with graceful fallback)
- [ ] ✅ State persists after reload
- [ ] ✅ Grandmother-friendly UI/copy
- [ ] ✅ Responsive layout
- [ ] ✅ Keyboard accessibility
- [ ] ✅ Unit tests for state management (Zustand)
- [ ] ✅ Cypress smoke test for 5-slide deck

---

## 📊 Test Summary

| Category | Status | Notes |
|----------|--------|-------|
| Unit Tests | ✅ Pass | 13/13 tests |
| Linting | ✅ Pass | No errors |
| Build | ✅ Pass | 501KB bundle |
| Manual Testing | 🔄 In Progress | Use checklist above |
| E2E Tests | 🔄 Pending | Run Cypress |
| Accessibility | 🔄 Pending | Manual verification |

---

## 🐛 Known Issues / Limitations

1. **API Endpoint**: `/api/slides/draft` not implemented (graceful fallback)
2. **Bundle Size**: 501KB (Fabric.js is large, consider code-splitting)
3. **Max Slides**: Hard limit of 5 by design
4. **Image Upload**: Client-side only (FileReader), no server upload

---

## 📝 Completion Criteria

**Phase 1 is COMPLETE when**:
- All automated tests pass
- Manual verification checklist completed
- Cypress E2E tests pass
- No critical bugs found
- Documentation reviewed

---

*Last updated: After implementation completion*
