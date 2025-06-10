import { describe, it, expect, beforeEach } from 'vitest';
import './CarouselSlide';

describe('CarouselSlide', () => {
  let slide: HTMLElement;

  beforeEach(() => {
    slide = document.createElement('carousel-slide');
    document.body.appendChild(slide);
  });

  it('should render with the provided image source', async () => {
    slide.setAttribute('src', '/test-image.jpg');
    
    // Wait for a render cycle
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const shadow = slide.shadowRoot;
    const slideDiv = shadow?.querySelector('.slide') as HTMLElement;
    const backgroundImage = window.getComputedStyle(slideDiv).backgroundImage;
    expect(backgroundImage).toBe('url("/test-image.jpg")');
  });

  it('should update when src attribute changes', async () => {
    slide.setAttribute('src', '/initial.jpg');
    slide.setAttribute('src', '/updated.jpg');
    
    // Wait for a render cycle
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const shadow = slide.shadowRoot;
    const slideDiv = shadow?.querySelector('.slide') as HTMLElement;
    const backgroundImage = window.getComputedStyle(slideDiv).backgroundImage;
    expect(backgroundImage).toBe('url("/updated.jpg")');
  });
});