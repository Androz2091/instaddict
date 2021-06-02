import { writable } from 'svelte/store';

const previouslyStoredData = localStorage.getItem('data');

export const data = writable(previouslyStoredData ? JSON.parse(previouslyStoredData) : null);
export const loaded = writable(!!previouslyStoredData);
export const loadTask = writable(null);

data.subscribe((value) => {
    if (value) localStorage.setItem('data', JSON.stringify(value));
    else localStorage.removeItem('data');
});
