import { describe, it, expect, beforeEach, vi } from 'vitest';
import './CarouselControls';

describe('CarouselControls', () => {
  let controls: HTMLElement;

  beforeEach(() => {
    controls = document.createElement('carousel-controls');
    document.body.appendChild(controls);
  });

  it('should render previous and next buttons', () => {
    const buttons = controls.shadowRoot?.querySelectorAll('.button');
    expect(buttons?.length).toBe(2);
    
    const prevButton = controls.shadowRoot?.querySelector('.prev');
    const nextButton = controls.shadowRoot?.querySelector('.next');
    expect(prevButton).toBeTruthy();
    expect(nextButton).toBeTruthy();
  });

  it('should emit prev-slide event when previous button is clicked', () => {
    const spy = vi.fn();
    controls.addEventListener('prev-slide', spy);
    
    const shadow = controls.shadowRoot as ShadowRoot;
    const prevButton = shadow.querySelector('.prev') as HTMLButtonElement;
    prevButton?.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit next-slide event when next button is clicked', () => {
    const spy = vi.fn();
    controls.addEventListener('next-slide', spy);
    
    const shadow = controls.shadowRoot as ShadowRoot;
    const nextButton = shadow.querySelector('.next') as HTMLButtonElement;
    nextButton?.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should have proper ARIA labels', () => {
    const prevButton = controls.shadowRoot?.querySelector('.prev');
    const nextButton = controls.shadowRoot?.querySelector('.next');

    expect(prevButton?.getAttribute('aria-label')).toBe('Previous slide');
    expect(nextButton?.getAttribute('aria-label')).toBe('Next slide');
  });
});