import { writable } from 'svelte/store';

export const user = writable(null);

// Initialize from localStorage if available
if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('user');
    if (stored) {
        user.set(JSON.parse(stored));
    }
}