import { describe, it, expect, beforeEach, vi } from 'vitest';
import './CarouselNav';

describe('CarouselNav', () => {
  let nav: HTMLElement;

  beforeEach(() => {
    nav = document.createElement('carousel-nav');
    document.body.appendChild(nav);
  });

  it('should render navigation dots based on total-slides attribute', () => {
    nav.setAttribute('total-slides', '3');
    nav.setAttribute('current-slide', '0');
    
    const dots = nav.shadowRoot?.querySelectorAll('.nav-button');
    expect(dots?.length).toBe(3);
  });

  it('should highlight the current slide dot', () => {
    nav.setAttribute('total-slides', '3');
    nav.setAttribute('current-slide', '1');
    
    const dots = nav.shadowRoot?.querySelectorAll('.nav-button');
    expect(dots?.[1].classList.contains('is-active')).toBe(true);
  });

  it('should emit slide-selected event when dot is clicked', () => {
    const spy = vi.fn();
    nav.addEventListener('slide-selected', spy);

    nav.setAttribute('total-slides', '3');
    nav.setAttribute('current-slide', '0');
    
    const dots = Array.from(nav.shadowRoot?.querySelectorAll('.nav-button') as NodeListOf<HTMLElement>);
    (dots[1] as HTMLButtonElement).click();

    expect(spy).toHaveBeenCalled();
    const event = spy.mock.calls[0][0] as CustomEvent;
    expect(event.detail.slideIndex).toBe(1);
  });

  it('should update progress bar width', async () => {
    nav.setAttribute('total-slides', '3');
    nav.setAttribute('progress', '50');
    
    // Wait for a render cycle
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const progress = nav.shadowRoot?.querySelector('.progress') as HTMLElement;
    const style = window.getComputedStyle(progress);
    expect(style.transform).toContain('translateX(calc(-100% + 50%)');
  });

  it('should handle nav button click with missing data-slide attribute', () => {
    const spy = vi.fn();
    nav.addEventListener('slide-selected', spy);
    
    nav.setAttribute('total-slides', '3');
    nav.setAttribute('current-slide', '0');
    
    // Remove data-slide attribute from first button
    const buttons = nav.shadowRoot!.querySelectorAll('.nav-button');
    const firstButton = buttons[0] as HTMLElement;
    delete firstButton.dataset.slide;
    firstButton.click();

    expect(spy).toHaveBeenCalled();
    const event = spy.mock.calls[0][0] as CustomEvent;
    expect(event.detail.slideIndex).toBe(0);
  });
});