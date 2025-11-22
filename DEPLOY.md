# Deployment Guide for GitHub Pages

This guide will help you deploy your Habit Tracker to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your computer
- Node.js installed (v18 or higher)

## Option 1: Automatic Deployment with GitHub Actions (Recommended)

1. **Create a GitHub Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click "Settings" → "Pages"
   - Under "Source", select "GitHub Actions"

3. **Deploy**:
   - The GitHub Action will automatically build and deploy your app
   - Every push to `main` will trigger a new deployment
   - Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Option 2: Manual Deployment

1. **Build the Application**:
   ```bash
   npm install
   npm run build
   ```

2. **Deploy dist/public folder**:
   ```bash
   cd dist/public
   git init
   git add -A
   git commit -m 'Deploy'
   git push -f git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git main:gh-pages
   cd ../..
   ```

3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch
   - Save

4. **Access your site**:
   - Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Custom Domain (Optional)

1. Add a `CNAME` file to `client/public/` with your domain:
   ```
   yourdomain.com
   ```

2. Configure DNS settings with your domain provider:
   - Add a CNAME record pointing to `YOUR_USERNAME.github.io`

3. Enable custom domain in GitHub Pages settings

## Important Notes

- All data is stored locally in the browser (localStorage)
- No backend server is needed
- The app works completely client-side
- Users can export/import their data for backup

## Troubleshooting

### Blank page after deployment
- Check that your repository name matches the base path
- Verify the build completed successfully
- Check browser console for errors

### 404 errors on refresh
- The `404.html` file is included to handle client-side routing
- This redirects all routes to the main app

### Data not persisting
- Make sure browser allows localStorage
- Check that cookies and site data are not being cleared

## Testing Locally

Before deploying, test the build locally:

```bash
npm run build
npx serve dist/public
```

Visit `http://localhost:3000` to test the production build.
