/**
 * Navigation controls component that displays previous and next buttons for the carousel.
 * @customElement carousel-controls
 * 
 * @fires {CustomEvent} prev-slide - Fired when the previous button is clicked
 * @fires {CustomEvent} next-slide - Fired when the next button is clicked
 */
export class CarouselControls extends HTMLElement {
    private readonly shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.render();
    }

    private render(): void {
        this.shadow.innerHTML = `
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

        const prevButton = this.shadow.querySelector('.prev');
        const nextButton = this.shadow.querySelector('.next');

        prevButton?.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('prev-slide', {
                bubbles: true,
                composed: true
            }));
        });

        nextButton?.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('next-slide', {
                bubbles: true,
                composed: true
            }));
        });
    }
}

customElements.define('carousel-controls', CarouselControls);