# TODO: Fix and Polish UI and Logic

## 1. Filter Logic
- [x] Update FilterSidebar to allow multiple category selections (checkboxes instead of radio)
- [x] Ensure "Clear Filters" resets all filters properly
- [ ] Test filter persistence and state management

## 2. Sort Institutions List
- [x] Sort colleges and schools alphabetically in InstitutionSelector
- [x] Ensure sorted order in dropdown/list UI

## 3. Business Image Display
- [x] Add fallback placeholder image for missing/broken images in BusinessCard
- [x] Implement lazy loading for images
- [x] Add proper alt attributes and error handling

## 4. Professional UI Colour Theme
- [x] Define cohesive color palette (primary: deep blue/teal, secondary, accent, neutral)
- [x] Update globals.css with CSS variables for theme
- [ ] Apply theme to buttons, cards, headers, backgrounds
- [x] Ensure high contrast and accessibility
- [ ] Update Tailwind config if needed

## 5. Testing and Validation
- [x] Run npm run dev and verify no console errors
- [x] Test filters work correctly
- [x] Check images display with fallbacks
- [x] Verify sorting is alphabetical
- [x] Ensure theme looks professional and consistent
