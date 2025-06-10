import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initializeUI } from './script';

describe('Main Script', () => {
    beforeEach(() => {
        // Reset the DOM before each test
        document.body.innerHTML = `
            <h1 id="title"></h1>
            <div id="timestamp"></div>
        `;
        
        // Reset timers
        vi.useFakeTimers();
    });

    it('should set the title to "Carousel"', () => {
        initializeUI();
        const titleElement = document.getElementById('title');
        expect(titleElement?.textContent).toBe('Carousel');
    });

    it('should set timestamp with initial time', () => {
        const initialTime = new Date();
        vi.setSystemTime(initialTime);
        
        initializeUI();
        
        const timestampElement = document.getElementById('timestamp');
        expect(timestampElement?.textContent).toBe(initialTime.toLocaleTimeString());
    });

    it('should not update timestamp after initialization', () => {
        const initialTime = new Date();
        vi.setSystemTime(initialTime);
        
        initializeUI();
        
        const timestampElement = document.getElementById('timestamp');
        const initialValue = timestampElement?.textContent;
        
        // Advance time by 5 seconds
        vi.advanceTimersByTime(5000);
        
        // Timestamp should still show initial time
        expect(timestampElement?.textContent).toBe(initialValue);
    });
});