# Image Carousel Component

A modern, responsive image carousel built with Web Components and Vite. Features a sophisticated UI with auto-rotation, touch support, and smooth transitions.

## Features

- 🎯 Built with vanilla Web Components - no framework dependencies
- 🔄 Auto-rotation with progress indicator
- 👆 Touch swipe support
- ⌨️ Keyboard navigation support
- 📱 Responsive design with adaptive aspect ratios
- 🎨 Beautiful UI with backdrop blur effects
- ⏸️ Pause on hover functionality
- 🎭 Smooth transitions between slides

## Project Structure

```
├── src/
│   ├── assets/        # Image assets
│   ├── index.html     # Main HTML file
│   ├── script.js      # Web Components implementation
│   └── styles.css     # Global styles
├── package.json
└── vite.config.js     # Vite build configuration
```

## Components

### MainCarousel
The primary carousel container that manages slide transitions and user interactions.

```html
<main-carousel>
    <carousel-slide src="/image1.jpg"></carousel-slide>
    <carousel-slide src="/image2.jpg"></carousel-slide>
</main-carousel>
```

### CarouselNav
Navigation dots with progress indicator showing the current slide and auto-rotation progress.

### CarouselControls
Previous/Next navigation buttons with hover effects and backdrop blur.

### CarouselSlide
Individual slide component optimized for image display.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Preview production build:
   ```bash
   npm run preview
   ```

## Development

The project uses Vite for development and building. Source files are in the `src` directory and build output goes to `dist`.

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Technical Details

- Built with Web Components using Shadow DOM for encapsulation
- Responsive design with different aspect ratios:
  - Desktop (16:9)
  - Tablet (3:2)
  - Mobile (4:3)
- CSS features:
  - CSS Custom Properties
  - CSS Grid and Flexbox
  - Backdrop filters
  - Smooth scrolling
  - CSS animations
- Modern JavaScript features:
  - ES Modules
  - Custom Elements
  - Shadow DOM
  - Event delegation

## Browser Support

Supports all modern browsers that implement the Web Components specification:
- Chrome/Edge (Chromium)
- Firefox
- Safari

