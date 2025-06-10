/**
 * A navigation component for the carousel that displays dots for each slide and a progress bar.
 * @customElement carousel-nav
 * 
 * @attr {number} current-slide - The index of the currently active slide (0-based)
 * @attr {number} total-slides - The total number of slides in the carousel
 * @attr {number} progress - The progress percentage (0-100) for the current slide transition
 * 
 * @fires {CustomEvent} slide-selected - Fired when a navigation dot is clicked
 *        detail: { slideIndex: number } - The index of the selected slide
 */
class CarouselNav extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['current-slide', 'total-slides', 'progress'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const totalSlides = parseInt(this.getAttribute('total-slides')) || 0;
        const currentSlide = parseInt(this.getAttribute('current-slide')) || 0;
        const progress = parseFloat(this.getAttribute('progress')) || 0;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: absolute;
                    bottom: -30px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.2);
                    padding: 8px 16px;
                    border-radius: 20px;
                    backdrop-filter: blur(2px);
                    overflow: hidden;
                    width: fit-content;
                }
                .nav {
                    position: relative;
                    display: flex;
                    gap: clamp(5px, 1vw, 15px);
                    z-index: 2;
                    margin: 0;
                    padding: 0;
                }
                .progress {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.15);
                    width: 100%;
                    z-index: 1;
                    transform: translateX(calc(-100% + ${progress}%));
                    transition: transform 0.1s linear;
                }
                .nav-button {
                    width: clamp(10px, 1.2vw, 14px);
                    height: clamp(10px, 1.2vw, 14px);
                    border-radius: 50%;
                    border: none;
                    background: rgba(255, 255, 255, 0.5);
                    cursor: pointer;
                    padding: 0;
                    font-size: 0;
                    transition: transform 0.3s;
                    position: relative;
                    z-index: 1;
                }
                .nav-button:hover,
                .nav-button.is-active {
                    transform: scale(1.2);
                    background: rgba(255, 255, 255, 1);
                    box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
                }
            </style>
            <div class="progress"></div>
            <div class="nav">
                ${Array.from({ length: totalSlides }, (_, i) => `
                    <button class="nav-button ${i === currentSlide ? 'is-active' : ''}" 
                            data-slide="${i}"
                            aria-label="Go to slide ${i + 1}">
                    </button>
                `).join('')}
            </div>
        `;

        this.shadowRoot.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', () => {
                const slideIndex = parseInt(button.dataset.slide);
                this.dispatchEvent(new CustomEvent('slide-selected', {
                    detail: { slideIndex },
                    bubbles: true,
                    composed: true
                }));
            });
        });
    }
}

/**
 * Navigation controls component that displays previous and next buttons for the carousel.
 * @customElement carousel-controls
 * 
 * @fires {CustomEvent} prev-slide - Fired when the previous button is clicked
 * @fires {CustomEvent} next-slide - Fired when the next button is clicked
 */
class CarouselControls extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .button {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 10;
                    background: rgba(0, 0, 0, 0.2);
                    border: none;
                    width: clamp(35px, 4.5vw, 65px);
                    height: clamp(35px, 4.5vw, 65px);
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-size: clamp(18px, 2.2vw, 34px);
                    line-height: clamp(35px, 4.5vw, 65px);
                    color: rgba(255, 255, 255, 0.5);
                    backdrop-filter: blur(2px);
                }
                .button:hover {
                    background: rgba(0, 0, 0, 0.3);
                    color: rgba(255, 255, 255, 1);
                    transform: translateY(-50%) scale(1.1);
                    box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
                }
                .prev {
                    left: clamp(5px, 1vw, 20px);
                    padding-right: 3px;
                }
                .next {
                    right: clamp(5px, 1vw, 20px);
                    padding-left: 3px;
                }
            </style>
            <button class="button prev" aria-label="Previous slide">&#10094;</button>
            <button class="button next" aria-label="Next slide">&#10095;</button>
        `;

        const prevButton = this.shadowRoot.querySelector('.prev');
        const nextButton = this.shadowRoot.querySelector('.next');

        prevButton.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('prev-slide', {
                bubbles: true,
                composed: true
            }));
        });

        nextButton.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('next-slide', {
                bubbles: true,
                composed: true
            }));
        });
    }
}

/**
 * Individual slide component for the carousel
 * @customElement carousel-slide
 * 
 * @attr {string} src - The source URL of the image to display
 */
class CarouselSlide extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['src'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const src = this.getAttribute('src');
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    min-width: 100%;
                    width: 100%;
                    height: 100%;
                    position: relative;
                    scroll-snap-align: center;
                    scroll-snap-stop: always;
                }
                .slide {
                    width: 100%;
                    height: 100%;
                    background-image: url("${src}");
                    background-position: center;
                    background-size: contain;
                    background-repeat: no-repeat;
                }
            </style>
            <div class="slide"></div>
        `;
    }
}

/**
 * Main carousel component that manages slides, auto-rotation, and touch interactions.
 * Creates a responsive image carousel with navigation dots and controls.
 * @customElement main-carousel
 * 
 * Features:
 * - Auto-rotation with progress indicator
 * - Touch swipe support
 * - Keyboard navigation
 * - Responsive design with different aspect ratios for different screen sizes
 * - Smooth transitions between slides
 * - Pause on hover
 * 
 * Usage:
 * <main-carousel>
 *   <img src="slide1.jpg" class="slide">
 *   <img src="slide2.jpg" class="slide">
 * </main-carousel>
 */
class MainCarousel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentSlide = 0;
        this.progressValue = 0;
        this.autoRotateInterval = null;
        this.lastProgressUpdate = 0;
        this.rotationDelay = 5000;
        this.touchStartX = 0;
        this.totalSlides = 0;
    }

    connectedCallback() {
        this.render();
        this.startAutoRotate();
    }

    disconnectedCallback() {
        this.stopAutoRotate();
    }

    updateProgress = () => {
        const now = Date.now();
        if (this.lastProgressUpdate === 0) this.lastProgressUpdate = now;
        const delta = now - this.lastProgressUpdate;
        this.progressValue = this.progressValue + (delta / this.rotationDelay) * 100;
        
        if (this.progressValue >= 100) {
            this.progressValue = 0;
            this.goToSlide((this.currentSlide + 1) % this.totalSlides);
        }
        
        const nav = this.shadowRoot.querySelector('carousel-nav');
        if (nav) {
            nav.setAttribute('progress', this.progressValue);
        }
        this.lastProgressUpdate = now;
    }

    startAutoRotate() {
        this.stopAutoRotate();
        this.lastProgressUpdate = Date.now();
        this.autoRotateInterval = setInterval(this.updateProgress, 100);
    }

    stopAutoRotate() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }

    resetProgress() {
        this.progressValue = 0;
        this.lastProgressUpdate = Date.now();
        const nav = this.shadowRoot.querySelector('carousel-nav');
        if (nav) {
            nav.setAttribute('progress', 0);
        }
    }

    goToSlide(index) {
        if (!this.totalSlides) return;
        this.currentSlide = index;
        const slot = this.shadowRoot.querySelector('slot');
        const slides = slot.assignedElements();
        if (slides[this.currentSlide]) {
            slides[this.currentSlide].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
            
            const nav = this.shadowRoot.querySelector('carousel-nav');
            if (nav) {
                nav.setAttribute('current-slide', this.currentSlide);
            }
        }
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.stopAutoRotate();
    }

    handleTouchEnd(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = this.touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                this.goToSlide((this.currentSlide + 1) % this.totalSlides);
            } else {
                this.goToSlide((this.currentSlide - 1 + this.totalSlides) % this.totalSlides);
            }
        }
        this.startAutoRotate();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: relative;
                    width: min(90vw, 1800px);
                    aspect-ratio: 16/9;
                    margin: 2rem auto;
                    margin-bottom: calc(2rem + 30px);
                    border-radius: clamp(8px, 1vw, 16px);
                    display: block;
                }
                .viewport {
                    position: relative;
                    height: 100%;
                    width: 100%;
                    display: flex;
                    overflow-x: auto;
                    scroll-behavior: smooth;
                    scroll-snap-type: x mandatory;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .viewport::-webkit-scrollbar {
                    display: none;
                }
                ::slotted(.slide) {
                    min-width: 100%;
                    width: 100%;
                    height: 100%;
                    position: relative;
                    scroll-snap-align: center;
                    scroll-snap-stop: always;
                }
                @media (max-width: 480px) {
                    :host {
                        aspect-ratio: 4/3;
                        width: 95vw;
                    }
                }
                @media (min-width: 481px) and (max-width: 1024px) {
                    :host {
                        aspect-ratio: 3/2;
                    }
                }
                @media (min-width: 2560px) {
                    :host {
                        max-width: 2400px;
                    }
                }
            </style>
            <div class="viewport">
                <slot></slot>
            </div>
            <carousel-controls></carousel-controls>
            <carousel-nav current-slide="0" total-slides="4" progress="0"></carousel-nav>
        `;

        // Set up event listeners
        this.addEventListener('mouseenter', () => this.stopAutoRotate());
        this.addEventListener('mouseleave', () => this.startAutoRotate());
        this.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

        // Listen for control events
        this.shadowRoot.querySelector('carousel-controls').addEventListener('prev-slide', () => {
            this.stopAutoRotate();
            this.goToSlide((this.currentSlide - 1 + this.totalSlides) % this.totalSlides);
            this.startAutoRotate();
        });

        this.shadowRoot.querySelector('carousel-controls').addEventListener('next-slide', () => {
            this.stopAutoRotate();
            this.goToSlide((this.currentSlide + 1) % this.totalSlides);
            this.startAutoRotate();
        });

        this.shadowRoot.querySelector('carousel-nav').addEventListener('slide-selected', (e) => {
            this.stopAutoRotate();
            this.goToSlide(e.detail.slideIndex);
            this.startAutoRotate();
        });

        // Calculate total slides
        const slot = this.shadowRoot.querySelector('slot');
        slot.addEventListener('slotchange', () => {
            const slides = slot.assignedElements();
            this.totalSlides = slides.length;
            const nav = this.shadowRoot.querySelector('carousel-nav');
            nav.setAttribute('total-slides', this.totalSlides);
            slides.forEach(slide => slide.classList.add('slide'));
        });
    }
}

// Register custom elements
customElements.define('carousel-nav', CarouselNav);
customElements.define('carousel-controls', CarouselControls);
customElements.define('carousel-slide', CarouselSlide);
customElements.define('main-carousel', MainCarousel);