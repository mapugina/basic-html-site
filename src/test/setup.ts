import { vi } from 'vitest';
import { afterEach } from 'vitest';

afterEach(() => {
    document.body.innerHTML = '';
});

// Create mocks for properties that don't exist in test environment
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});