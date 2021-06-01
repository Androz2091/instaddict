import { writable } from 'svelte/store';

export const data = writable(null);
export const loaded = writable(false);
export const loadTask = writable(null);
