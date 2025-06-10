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
 */
export class MainCarousel extends HTMLElement {
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
        this.isHovering = false;
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
        if (this.isHovering) return;
        
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
        this.resetProgress();
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

        this.addEventListener('mouseenter', () => {
            this.isHovering = true;
            this.stopAutoRotate();
        });
        this.addEventListener('mouseleave', () => {
            this.isHovering = false;
            this.startAutoRotate();
        });
        this.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

        this.shadowRoot.querySelector('carousel-controls').addEventListener('prev-slide', () => {
            this.stopAutoRotate();
            this.goToSlide((this.currentSlide - 1 + this.totalSlides) % this.totalSlides);
            if (!this.isHovering) {
                this.startAutoRotate();
            }
        });

        this.shadowRoot.querySelector('carousel-controls').addEventListener('next-slide', () => {
            this.stopAutoRotate();
            this.goToSlide((this.currentSlide + 1) % this.totalSlides);
            if (!this.isHovering) {
                this.startAutoRotate();
            }
        });

        this.shadowRoot.querySelector('carousel-nav').addEventListener('slide-selected', (e) => {
            this.stopAutoRotate();
            this.goToSlide(e.detail.slideIndex);
            if (!this.isHovering) {
                this.startAutoRotate();
            }
        });

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

customElements.define('main-carousel', MainCarousel);