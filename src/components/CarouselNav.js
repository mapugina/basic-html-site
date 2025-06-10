
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
export class CarouselNav extends HTMLElement {
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

customElements.define('carousel-nav', CarouselNav);