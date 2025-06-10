/**
 * Individual slide component for the carousel
 * @customElement carousel-slide
 * 
 * @attr {string} src - The source URL of the image to display
 */
export class CarouselSlide extends HTMLElement {
    private readonly shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes(): string[] {
        return ['src'];
    }

    connectedCallback(): void {
        this.render();
    }

    attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    private render(): void {
        const src = this.getAttribute('src') || '';
        this.shadow.innerHTML = `
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

customElements.define('carousel-slide', CarouselSlide);