# Habit Tracker Dashboard Design Guidelines

## Design Approach
**Reference-Based:** GitHub's design language - clean, data-focused, with emphasis on contribution graphs and statistics. Secondary inspiration from Linear for modern typography and Notion for organized information hierarchy.

## Core Design Principles
1. **Data Clarity First:** Information density balanced with breathing room
2. **Progress at a Glance:** Visual feedback through heatmaps and charts
3. **Minimal Friction:** Quick habit logging without unnecessary clicks
4. **Professional Polish:** GitHub's refined aesthetic adapted for personal productivity

---

## Typography System

**Font Families:**
- Primary: Inter or SF Pro Display (system fonts via Google Fonts)
- Monospace: JetBrains Mono for statistics and numbers

**Hierarchy:**
- Page Titles: text-2xl font-semibold
- Section Headers: text-xl font-medium
- Card Titles: text-lg font-medium
- Body Text: text-base font-normal
- Statistics/Numbers: text-3xl font-bold (monospace)
- Labels: text-sm font-medium
- Metadata: text-xs font-normal

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section spacing: mb-8 to mb-12
- Card gaps: gap-4 to gap-6
- Container max-width: max-w-6xl

**Grid Structure:**
- Dashboard: Single column on mobile, asymmetric 2-column on desktop (main content 2/3, sidebar 1/3)
- Habit cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Statistics row: grid-cols-2 md:grid-cols-4

---

## Component Library

### Login Page
- Centered card layout (max-w-md)
- Logo/title at top with subtle icon
- User selector as card-based grid (2 columns on mobile, 3 on tablet)
- Each user card: rounded-lg border with avatar placeholder, username, and hover elevation
- "Remember me" checkbox below user grid
- Minimalist footer with app version

### Dashboard Layout

**Header Bar:**
- Fixed top navigation: logo left, user profile + logout right
- Date range selector (Today, Week, Month, Year)
- "Add Habit" button (primary action)

**Main Content Area:**

*Statistics Cards Row:*
- Four metric cards: Total Habits, Today's Progress, Current Streak, Best Streak
- Each card: rounded-lg with large number (text-3xl), label below, subtle icon

*Contribution Heatmap (GitHub-style):*
- Full-width card with month labels
- 7-row grid (weekdays) × 52 columns (weeks)
- Each cell: small square (w-3 h-3) with rounded corners
- Intensity legend at bottom-right
- Interactive tooltips on hover showing date and completion count

*Active Habits Section:*
- Grid of habit cards (responsive columns)
- Each card includes:
  - Habit name (text-lg font-medium)
  - Checkbox for today's completion (larger, rounded)
  - Mini weekly bar chart (last 7 days)
  - Streak counter with flame icon
  - Quick edit/delete icons (top-right)

**Sidebar (Desktop):**

*Today's Summary:*
- Circular progress ring (donut chart)
- Completion percentage in center
- List of today's habits with checkboxes

*Weekly Trends:*
- Line graph showing completion rate
- 7-day sparkline visualization

*Quick Stats:*
- Most consistent habit
- Needs attention (lowest streak)

### Habit Management Modal
- Overlay with blur backdrop
- Centered modal (max-w-lg)
- Form fields: Habit name, Category (optional tags), Target frequency
- Color picker for habit identification
- Save/Cancel buttons

### Visualizations

**Heatmap Specifications:**
- Cells: aspect-square with 2px gap
- Corner radius: rounded-sm
- Intensity levels: 5 states (0-4 completions)
- Month labels: text-xs above columns
- Day labels: text-xs on left (M/W/F only)

**Charts:**
- Bar charts: Vertical bars with rounded tops, minimal grid lines
- Line graphs: Smooth curves with gradient fill beneath
- Donut charts: Thick stroke (stroke-width-8), center cutout for percentage

---

## Interaction Patterns

**Habit Completion:**
- Click checkbox → immediate visual feedback (scale animation)
- Heatmap updates in real-time
- Streak counter increments with celebration micro-animation

**Data Entry:**
- Modal forms slide in from center with fade
- Input focus states with subtle outline
- Inline validation messages

**Navigation:**
- Tab-based switching between views (Dashboard, History, Analytics)
- Smooth transitions without full page reloads

---

## Responsive Behavior

**Mobile (< 768px):**
- Single column layout
- Sidebar content moves below main content
- Heatmap scrolls horizontally with sticky month labels
- Statistics stack vertically
- Habit cards full-width

**Tablet (768px - 1024px):**
- 2-column habit grid
- Heatmap remains full-width
- Sidebar converts to tabbed sections

**Desktop (> 1024px):**
- Full sidebar layout
- 3-column habit grid
- All visualizations visible simultaneously

---

## Accessibility & Performance

- Minimum touch targets: 44×44px for checkboxes and buttons
- Keyboard navigation: Tab through habits, Enter to toggle
- Screen reader labels for all interactive elements
- Lazy load historical data beyond current month
- LocalStorage auto-save on every action (debounced)

---

## Visual Hierarchy

1. **Primary Focus:** Today's habits and contribution heatmap
2. **Secondary:** Statistics and streaks
3. **Tertiary:** Historical analytics and trends

Use size, weight, and spacing to establish this hierarchy - not relying on colors alone.