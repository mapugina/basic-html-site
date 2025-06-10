/**
 * Individual slide component for the carousel
 * @customElement carousel-slide
 * 
 * @attr {string} src - The source URL of the image to display
 */
export class CarouselSlide extends HTMLElement {
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

customElements.define('carousel-slide', CarouselSlide);