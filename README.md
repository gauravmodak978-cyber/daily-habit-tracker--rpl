# Habit Tracker Dashboard

A beautiful, interactive habit tracking application with a GitHub-style contribution heatmap. Track your daily habits, build streaks, and visualize your progress with stunning data visualizations.

## Features

- **Multi-User Support**: Up to 10 users with personalized profiles
- **GitHub-Style Heatmap**: 365-day contribution graph showing habit completion
- **Interactive Statistics**: Real-time progress tracking with streak counters
- **Beautiful Visualizations**: Donut charts, line graphs, and bar charts
- **Dark Mode**: Full dark/light theme support
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Automatic Login**: "Remember me" functionality for quick access
- **Local Storage**: All data stored client-side - no server required
- **GitHub Pages Compatible**: Deploy anywhere as a static site

## Quick Start

### Development

```bash
npm install
npm run dev
```

Visit `http://localhost:5000` to see the app.

### Building for GitHub Pages

```bash
npm run build
```

The built files will be in the `dist` folder, ready to deploy to GitHub Pages.

## Deployment to GitHub Pages

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Create a GitHub repository** and push your code

3. **Enable GitHub Pages**:
   - Go to your repository Settings
   - Navigate to Pages
   - Select "Deploy from a branch"
   - Choose `main` branch and `/root` folder (or use GitHub Actions)

4. **Upload the dist folder**:
   - You can push the entire project including `dist/`
   - Or use GitHub Actions to build and deploy automatically

### Alternative: Manual Deployment

1. Build the project locally
2. Copy everything from the `dist/` folder
3. Create a new branch called `gh-pages`
4. Add all files from `dist/` to the root of `gh-pages`
5. Push to GitHub
6. Enable GitHub Pages on the `gh-pages` branch

## Project Structure

```
habit-tracker/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components (Login, Dashboard)
│   │   ├── lib/         # Utilities and helpers
│   │   └── App.tsx      # Main app component
│   └── index.html
├── server/              # Development server (not used in production)
├── shared/              # Shared types and schemas
└── dist/                # Built files (created after npm run build)
```

## Default Users

The application comes with 10 pre-configured users:
- Alex Chen (@alex)
- Jordan Smith (@jordan)
- Sam Taylor (@sam)
- Riley Morgan (@riley)
- Casey Parker (@casey)
- Morgan Lee (@morgan)
- Drew Anderson (@drew)
- Quinn Davis (@quinn)
- Avery Wilson (@avery)
- Hayden Brown (@hayden)

## Data Storage

All data is stored in the browser's localStorage:
- User data and preferences
- Habits and their properties
- Daily completion records
- Theme preferences

Data persists across sessions and is scoped per user.

## Technologies Used

- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Recharts** - Data visualization
- **Wouter** - Lightweight routing
- **Vite** - Build tool

## Browser Support

Works in all modern browsers that support:
- ES6+
- LocalStorage
- CSS Grid and Flexbox

## License

MIT

## Contributing

Feel free to fork, modify, and use this project for your own habit tracking needs!
