interface SlideSelectedEvent extends CustomEvent {
    detail: {
        slideIndex: number;
    };
}

/**
 * Main carousel component that manages slides, auto-rotation, and touch interactions.
 * Creates a responsive image carousel with navigation dots and controls.
 * @customElement main-carousel
 */
export class MainCarousel extends HTMLElement {
    private readonly shadow: ShadowRoot;
    private currentSlide: number;
    private progressValue: number;
    private autoRotateInterval: number | null;
    private lastProgressUpdate: number;
    private readonly rotationDelay: number;
    private touchStartX: number;
    private totalSlides: number;
    private isHovering: boolean;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.currentSlide = 0;
        this.progressValue = 0;
        this.autoRotateInterval = null;
        this.lastProgressUpdate = 0;
        this.rotationDelay = 5000;
        this.touchStartX = 0;
        this.totalSlides = 0;
        this.isHovering = false;

        // Bind methods to preserve 'this' context
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
    }

    connectedCallback(): void {
        this.render();
        this.startAutoRotate();
    }

    disconnectedCallback(): void {
        this.stopAutoRotate();
    }

    private updateProgress(): void {
        const now = Date.now();
        if (this.lastProgressUpdate === 0) this.lastProgressUpdate = now;
        const delta = now - this.lastProgressUpdate;
        this.progressValue = this.progressValue + (delta / this.rotationDelay) * 100;
        
        if (this.progressValue >= 100) {
            this.progressValue = 0;
            this.goToSlide((this.currentSlide + 1) % this.totalSlides);
        }
        
        const nav = this.shadow.querySelector('carousel-nav');
        if (nav) {
            nav.setAttribute('progress', this.progressValue.toString());
        }
        this.lastProgressUpdate = now;
    }

    private startAutoRotate(): void {
        if (this.isHovering) return;
        
        this.stopAutoRotate();
        this.lastProgressUpdate = Date.now();
        this.autoRotateInterval = window.setInterval(this.updateProgress, 100);
    }

    private stopAutoRotate(): void {
        if (this.autoRotateInterval) {
            window.clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }

    private resetProgress(): void {
        this.progressValue = 0;
        this.lastProgressUpdate = Date.now();
        const nav = this.shadow.querySelector('carousel-nav');
        if (nav) {
            nav.setAttribute('progress', '0');
        }
    }

    private goToSlide(index: number): void {
        if (!this.totalSlides) return;
        this.currentSlide = index;
        this.resetProgress();

        const slot = this.shadow.querySelector('slot');
        if (!slot) return;

        const slides = slot.assignedElements();
        const targetSlide = slides[this.currentSlide];
        if (targetSlide) {
            targetSlide.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
            
            const nav = this.shadow.querySelector('carousel-nav');
            if (nav) {
                nav.setAttribute('current-slide', this.currentSlide.toString());
            }
        }
    }

    private handleTouchStart(e: TouchEvent): void {
        this.touchStartX = e.touches[0].clientX;
        this.stopAutoRotate();
    }

    private handleTouchEnd(e: TouchEvent): void {
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

    private render(): void {
        this.shadow.innerHTML = `
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
        this.addEventListener('touchstart', this.handleTouchStart, { passive: true });
        this.addEventListener('touchend', this.handleTouchEnd, { passive: true });

        const controls = this.shadow.querySelector('carousel-controls');
        if (controls) {
            controls.addEventListener('prev-slide', () => {
                this.stopAutoRotate();
                this.goToSlide((this.currentSlide - 1 + this.totalSlides) % this.totalSlides);
                if (!this.isHovering) {
                    this.startAutoRotate();
                }
            });

            controls.addEventListener('next-slide', () => {
                this.stopAutoRotate();
                this.goToSlide((this.currentSlide + 1) % this.totalSlides);
                if (!this.isHovering) {
                    this.startAutoRotate();
                }
            });
        }

        const nav = this.shadow.querySelector('carousel-nav');
        if (nav) {
            nav.addEventListener('slide-selected', ((e: Event) => {
                const customEvent = e as SlideSelectedEvent;
                this.stopAutoRotate();
                this.goToSlide(customEvent.detail.slideIndex);
                if (!this.isHovering) {
                    this.startAutoRotate();
                }
            }) as EventListener);
        }

        const slot = this.shadow.querySelector('slot');
        if (slot) {
            slot.addEventListener('slotchange', () => {
                const slides = slot.assignedElements();
                this.totalSlides = slides.length;
                const nav = this.shadow.querySelector('carousel-nav');
                if (nav) {
                    nav.setAttribute('total-slides', this.totalSlides.toString());
                }
                slides.forEach(slide => slide.classList.add('slide'));
            });
        }
    }
}

customElements.define('main-carousel', MainCarousel);