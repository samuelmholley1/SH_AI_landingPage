# Schedule Page - Samuel Holley AI Consulting

This is the scheduling page for booking AI audit consultations.

## Development

For local development, open `index.html` directly in a browser. All assets are referenced relative to the shared assets folder.

## Deployment

This project uses Vercel's zero-config deployment with conventional script naming.

### Zero-Config Setup
- **Build Script**: `npm run build` (Vercel's default convention)
- **Output Directory**: `public` (auto-detected by Vercel)
- **No Manual Configuration**: Everything is handled by convention

### Build Process
The build script creates a `public/` directory containing:
- `index.html` (copied from root)
- `assets/` (copied from `../shared/assets/`)

This flattens the directory structure for deployment while maintaining the shared assets architecture for development.

### Vercel Configuration
No manual configuration required! Vercel automatically:
1. Detects the `package.json` file
2. Runs `npm run build`
3. Serves the `public/` directory
4. Handles all deployment settings via convention

## Features

- Professional Calendly integration with skeleton loader
- Responsive design matching brand guidelines
- Smooth transitions between loading and loaded states
