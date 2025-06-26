# Schedule Page - Samuel Holley AI Consulting

This is the scheduling page for booking AI audit consultations.

## Development

For local development, open `index.html` directly in a browser. All assets are referenced relative to the shared assets folder.

## Deployment

This project uses explicit Vercel configuration to eliminate all deployment ambiguity.

### Vercel Configuration Files
- **`vercel.json`**: Explicit build configuration
- **`package.json`**: Contains the `build` script
- **No Manual UI Settings Required**: Everything is defined in code

### Configuration Details
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "public"
}
```

### Build Process
The build script creates a `public/` directory containing:
- `index.html` (copied from root with `assets/` paths)
- `assets/` (copied from `../shared/assets/`)

### Path Alignment
- **HTML paths**: `href="assets/style.css"`
- **Build output**: `public/assets/style.css`
- **Result**: Perfect alignment, no 404 errors

## Features

- Professional Calendly integration with skeleton loader
- Responsive design matching brand guidelines
- Smooth transitions between loading and loaded states
