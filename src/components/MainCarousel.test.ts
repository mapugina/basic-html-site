import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import './MainCarousel';

describe('MainCarousel', () => {
  let carousel: HTMLElement;
  
  beforeEach(() => {
    vi.useFakeTimers();
    carousel = document.createElement('main-carousel');
    document.body.appendChild(carousel);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render carousel with navigation and controls', () => {
    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    const controls = carousel.shadowRoot?.querySelector('carousel-controls');
    const viewport = carousel.shadowRoot?.querySelector('.viewport');

    expect(nav).toBeTruthy();
    expect(controls).toBeTruthy();
    expect(viewport).toBeTruthy();
  });

  it('should update current slide when nav dot is clicked', () => {
    const slides = [
      document.createElement('carousel-slide'),
      document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    nav?.dispatchEvent(new CustomEvent('slide-selected', {
      detail: { slideIndex: 1 },
      bubbles: true,
      composed: true
    }));

    const currentSlideAttr = nav?.getAttribute('current-slide');
    expect(currentSlideAttr).toBe('1');
  });

  it('should handle touch swipe interactions', () => {
    const slides = [
      document.createElement('carousel-slide'),
      document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    carousel.dispatchEvent(new TouchEvent('touchstart', {
      touches: [{ clientX: 500 } as Touch]
    }));

    carousel.dispatchEvent(new TouchEvent('touchend', {
      changedTouches: [{ clientX: 400 } as Touch]
    }));

    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    expect(nav?.getAttribute('current-slide')).toBe('1');
  });

  it('should auto-rotate slides', () => {
    const slides = [
      document.createElement('carousel-slide'),
      document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    // Advance timer by rotation delay
    vi.advanceTimersByTime(5000);

    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    expect(nav?.getAttribute('current-slide')).toBe('1');
  });

  it('should pause auto-rotation on hover', () => {
    const slides = [
      document.createElement('carousel-slide'),
      document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    carousel.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(5000);

    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    expect(nav?.getAttribute('current-slide')).toBe('0');
  });

  it('should handle prev/next button clicks', () => {
    const slides = [
      document.createElement('carousel-slide'),
      document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    const controls = carousel.shadowRoot?.querySelector('carousel-controls');
    controls?.dispatchEvent(new CustomEvent('next-slide', {
      bubbles: true,
      composed: true
    }));

    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    expect(nav?.getAttribute('current-slide')).toBe('1');
  });

  it('should handle progress updates correctly', () => {
    const slides = [
      document.createElement('carousel-slide'),
      document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    // Advance timer partially
    vi.advanceTimersByTime(2500); // Half of rotation delay

    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    expect(nav?.getAttribute('progress')).toBeDefined();
    expect(parseFloat(nav?.getAttribute('progress') || '0')).toBeGreaterThan(0);
  });

  it('should handle goToSlide with invalid index', () => {
    const slides = [
      document.createElement('carousel-slide'),
      document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    nav?.dispatchEvent(new CustomEvent('slide-selected', {
      detail: { slideIndex: -1 },
      bubbles: true,
      composed: true
    }));

    expect(nav?.getAttribute('current-slide')).toBe('0');
  });

  it('should handle slot changes', () => {
    const slot = carousel.shadowRoot?.querySelector('slot');
    expect(slot).toBeTruthy();

    const slides = [
      document.createElement('carousel-slide'),
      document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    // Manually trigger slotchange
    slot?.dispatchEvent(new Event('slotchange'));

    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    expect(nav?.getAttribute('total-slides')).toBe('2');
    expect(slides[0].classList.contains('slide')).toBe(true);
    expect(slides[1].classList.contains('slide')).toBe(true);
  });

  it('should handle auto-rotation correctly with mouse events', () => {
    const slides = [
      document.createElement('carousel-slide'),
      document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    // Mouse enter should stop auto-rotation
    carousel.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(5000);
    let nav = carousel.shadowRoot?.querySelector('carousel-nav');
    expect(nav?.getAttribute('current-slide')).toBe('0');

    // Mouse leave should restart auto-rotation
    carousel.dispatchEvent(new Event('mouseleave'));
    vi.advanceTimersByTime(5000);
    nav = carousel.shadowRoot?.querySelector('carousel-nav');
    expect(nav?.getAttribute('current-slide')).toBe('1');
  });

  it('should handle navigation edge cases', () => {
    const slides = [
      document.createElement('carousel-slide'),
      document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    // Test prev button at start (should wrap to end)
    const controls = carousel.shadowRoot?.querySelector('carousel-controls');
    controls?.dispatchEvent(new CustomEvent('prev-slide', {
      bubbles: true,
      composed: true
    }));

    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    expect(nav?.getAttribute('current-slide')).toBe('1');
  });

  it('should handle touch events with small movements', () => {
    const slides = [
      document.createElement('carousel-slide'),
      document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    // Small movement (less than threshold) shouldn't change slide
    carousel.dispatchEvent(new TouchEvent('touchstart', {
      touches: [{ clientX: 500 } as Touch]
    }));

    carousel.dispatchEvent(new TouchEvent('touchend', {
      changedTouches: [{ clientX: 480 } as Touch]
    }));

    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    expect(nav?.getAttribute('current-slide')).toBe('0');
  });

  it('should handle navigation button clicks while hovering', () => {
    const slides = [
      document.createElement('carousel-slide'),
      document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    // Set hovering state
    carousel.dispatchEvent(new Event('mouseenter'));

    // Click next button
    const controls = carousel.shadowRoot?.querySelector('carousel-controls');
    controls?.dispatchEvent(new CustomEvent('next-slide', {
      bubbles: true,
      composed: true
    }));

    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    expect(nav?.getAttribute('current-slide')).toBe('1');

    // Should not auto-rotate while hovering
    vi.advanceTimersByTime(5000);
    expect(nav?.getAttribute('current-slide')).toBe('1');
  });

  it('should handle initial progress update correctly', () => {
    const slides = [
      document.createElement('carousel-slide'),
      document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    // Reset internal timer
    carousel.dispatchEvent(new Event('mouseenter'));
    carousel.dispatchEvent(new Event('mouseleave'));

    // First progress update after reset
    vi.advanceTimersByTime(100);

    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    expect(nav?.getAttribute('progress')).toBeDefined();
    expect(parseFloat(nav?.getAttribute('progress') || '0')).toBeGreaterThan(0);
  });

  it('should handle initial progress update with timing edge cases', () => {
    const slides = [
      document.createElement('carousel-slide'),
      document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    // Force lastProgressUpdate to 0
    carousel.dispatchEvent(new Event('mouseenter'));
    carousel.dispatchEvent(new Event('mouseleave'));
    
    // First progress update after reset
    vi.advanceTimersByTime(1);
    
    // Second update to test delta calculation
    vi.advanceTimersByTime(100);

    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    expect(nav?.getAttribute('progress')).toBeDefined();
    expect(parseFloat(nav?.getAttribute('progress') || '0')).toBeGreaterThan(0);
  });

  it('should handle goToSlide with null slot', () => {
    // Remove the slot element
    const viewport = carousel.shadowRoot?.querySelector('.viewport');
    if (viewport) {
      viewport.innerHTML = '';
    }

    // Try to navigate
    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    nav?.dispatchEvent(new CustomEvent('slide-selected', {
      detail: { slideIndex: 1 },
      bubbles: true,
      composed: true
    }));

    // Should not throw and maintain current state
    expect(nav?.getAttribute('current-slide')).toBe('0');
  });

  it('should handle progress reset and slot removal', () => {
    const slides = [
      document.createElement('carousel-slide'),
      document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    // Reset progress
    carousel.dispatchEvent(new Event('mouseenter'));
    carousel.dispatchEvent(new Event('mouseleave'));
    
    // Force a progress update before slot removal
    vi.advanceTimersByTime(100);
    const progressBefore = carousel.shadowRoot?.querySelector('carousel-nav')?.getAttribute('progress');
    expect(parseFloat(progressBefore || '0')).toBeGreaterThan(0);

    // Remove slot and verify component doesn't break
    const viewport = carousel.shadowRoot?.querySelector('.viewport');
    const slot = carousel.shadowRoot?.querySelector('slot');
    if (viewport && slot) {
      viewport.removeChild(slot);
    }

    // Try to navigate
    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    nav?.dispatchEvent(new CustomEvent('slide-selected', {
      detail: { slideIndex: 1 },
      bubbles: true,
      composed: true
    }));

    // Should maintain state
    expect(nav?.getAttribute('current-slide')).toBe('0');
  });

  it('should handle missing slot element during slide transition', () => {
    const slides = [
      document.createElement('carousel-slide'),
      document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    // Remove slot but keep viewport
    const viewport = carousel.shadowRoot?.querySelector('.viewport');
    const slot = carousel.shadowRoot?.querySelector('slot');
    if (viewport && slot) {
      viewport.removeChild(slot);
    }

    // Try to navigate with missing slot
    const controls = carousel.shadowRoot?.querySelector('carousel-controls');
    controls?.dispatchEvent(new CustomEvent('next-slide', {
      bubbles: true,
      composed: true
    }));

    // Component should handle this gracefully
    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    expect(nav?.getAttribute('current-slide')).toBe('0');
  });

  it('should handle initial lastProgressUpdate correctly', () => {
    const slides = [
      document.createElement('carousel-slide'),
      document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    // Reset all timers and system time
    vi.setSystemTime(0);
    carousel.dispatchEvent(new Event('mouseleave'));
    
    // Advance system time and timers enough to see progress
    vi.setSystemTime(2000);
    vi.advanceTimersByTime(500);

    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    expect(nav?.getAttribute('progress')).toBeDefined();
    const progress = parseFloat(nav?.getAttribute('progress') || '0');
    expect(progress).toBeGreaterThan(0);
  });

  it('should handle goToSlide with invalid slot element', () => {
    const slides = [
      document.createElement('carousel-slide'),
      document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    // Break the slot reference but keep the elements
    const viewport = carousel.shadowRoot?.querySelector('.viewport');
    const slot = carousel.shadowRoot?.querySelector('slot');
    if (viewport && slot) {
      const div = document.createElement('div');
      div.append(...slides);
      viewport.replaceChild(div, slot);
    }

    // Try to navigate
    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    nav?.dispatchEvent(new CustomEvent('slide-selected', {
      detail: { slideIndex: 1 },
      bubbles: true,
      composed: true
    }));

    // Should maintain state without error
    expect(nav?.getAttribute('current-slide')).toBe('0');
  });

  it('should handle initial progress with lastProgressUpdate=0', () => {
    const slides = [
      document.createElement('carousel-slide'),
      document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    // Reset and force lastProgressUpdate to 0
    carousel.dispatchEvent(new Event('mouseenter')); // stops auto-rotate
    carousel.dispatchEvent(new Event('mouseleave')); // restarts with lastProgressUpdate=0
    
    // Advance timer to see progress update
    vi.advanceTimersByTime(100);

    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    const progress = parseFloat(nav?.getAttribute('progress') || '0');
    expect(progress).toBeGreaterThan(0);
  });

  it('should handle negative swipe direction', () => {
    const slides = [
      document.createElement('carousel-slide'),
      document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    // Start swipe from right to left (negative direction)
    carousel.dispatchEvent(new TouchEvent('touchstart', {
      touches: [{ clientX: 100 } as Touch]
    }));

    carousel.dispatchEvent(new TouchEvent('touchend', {
      changedTouches: [{ clientX: 200 } as Touch] // Moving finger right
    }));

    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    expect(nav?.getAttribute('current-slide')).toBe('1'); // Should go to last slide
  });

  it('should handle progress update when lastProgressUpdate is 0', () => {
    const slides = [
      document.createElement('carousel-slide'),
      document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    // Reset all timers and state
    vi.setSystemTime(0);
    carousel.dispatchEvent(new Event('mouseenter'));
    carousel.dispatchEvent(new Event('mouseleave'));
    
    // Let the interval take effect and trigger multiple updates
    vi.advanceTimersByTime(200);

    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    const progress = parseFloat(nav?.getAttribute('progress') || '0');
    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThanOrEqual(4); // (200ms / 5000ms) * 100
  });

  it('should clean up auto-rotate interval when disconnected', () => {
    const slides = [
        document.createElement('carousel-slide'),
        document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    // Force start auto-rotate
    carousel.dispatchEvent(new Event('mouseleave'));
    
    // Remove from DOM to trigger disconnectedCallback
    document.body.removeChild(carousel);

    // Verify interval was cleared by checking that progress doesn't update
    vi.advanceTimersByTime(200);
    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    const progress = parseFloat(nav?.getAttribute('progress') || '0');
    expect(progress).toBe(0);
  });

  it('should not start auto-rotate while hovering', () => {
    const slides = [
        document.createElement('carousel-slide'),
        document.createElement('carousel-slide')
    ];
    slides.forEach(slide => carousel.appendChild(slide));

    // Enter hover state and ensure progress is reset
    carousel.dispatchEvent(new Event('mouseenter'));
    
    // Reset time and advance timer to allow for a potential progress update
    vi.setSystemTime(0);
    vi.advanceTimersByTime(100);
    
    // Verify progress remains at 0 since we're still hovering
    const nav = carousel.shadowRoot?.querySelector('carousel-nav');
    const progress = parseFloat(nav?.getAttribute('progress') || '0');
    expect(progress).toBe(0);
  });
});