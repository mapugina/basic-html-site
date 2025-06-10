# Image Carousel Component

A modern, responsive image carousel built with Web Components, TypeScript, and Vite. Features a sophisticated UI with auto-rotation, touch support, and smooth transitions.

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
│   ├── components/    # Web Components
│   │   ├── CarouselNav.js
│   │   ├── CarouselControls.js
│   │   ├── CarouselSlide.js
│   │   └── MainCarousel.js
│   ├── index.html     # Main HTML file
│   ├── script.js      # Component imports
│   └── styles.css     # Global styles
├── package.json
└── vite.config.js     # Vite build configuration
```

## Components

### MainCarousel (`main-carousel`)
The primary carousel container that manages slide transitions and user interactions.

```html
<main-carousel>
    <carousel-slide src="/image1.jpg"></carousel-slide>
    <carousel-slide src="/image2.jpg"></carousel-slide>
</main-carousel>
```

Features:
- Auto-rotation with configurable delay (default: 5000ms)
- Touch swipe support with threshold detection
- Responsive aspect ratios (16:9 desktop, 3:2 tablet, 4:3 mobile)
- Pause on hover functionality
- Event management for all user interactions

### CarouselNav (`carousel-nav`)
Navigation dots with progress indicator showing the current slide and auto-rotation progress.

Attributes:
- `current-slide`: Current slide index (0-based)
- `total-slides`: Total number of slides
- `progress`: Current progress percentage (0-100)

### CarouselControls (`carousel-controls`)
Previous/Next navigation buttons with hover effects and backdrop blur.

Events:
- `prev-slide`: Emitted when previous button is clicked
- `next-slide`: Emitted when next button is clicked

### CarouselSlide (`carousel-slide`)
Individual slide component optimized for image display.

Attributes:
- `src`: Image source URL

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

The project uses TypeScript with strict type checking enabled and Vite for development and building. Source files are in the `src` directory and build output goes to `dist`.

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run type-check` - Run TypeScript type checks
- `npm run clean` - Clean build outputs

### Testing and Type Safety
- 100% line coverage across all components
- Comprehensive unit tests using Vitest
- Strict TypeScript configuration with all strict checks enabled
- Automated type checking in CI pipeline

## Technical Details

- Built with Web Components and TypeScript
- Full test coverage with Vitest
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

## License

ISC

