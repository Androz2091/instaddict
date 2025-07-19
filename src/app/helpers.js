// Cache for word processing to avoid recomputation
const wordCache = new Map();

export const getFavoriteWords = (words) => {
    const cacheKey = words.length + '_' + words.slice(0, 10).join('_');
    if (wordCache.has(cacheKey)) {
        return wordCache.get(cacheKey);
    }

    words = words.flat(3);
    const wordCounts = new Map();
    const minLength = 3;
    
    for (const word of words) {
        if (!word) continue;
        const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
        if (cleanWord.length >= minLength) {
            wordCounts.set(cleanWord, (wordCounts.get(cleanWord) || 0) + 1);
        }
    }

    const sortedWords = Array.from(wordCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }));

    // Cache result if words array is reasonably sized
    if (words.length < 10000) {
        wordCache.set(cacheKey, sortedWords);
        // Limit cache size
        if (wordCache.size > 100) {
            const firstKey = wordCache.keys().next().value;
            wordCache.delete(firstKey);
        }
    }

    return sortedWords;
};

// Cache for byte formatting
const formatCache = new Map();

export const formatBytes = (a, b = 2) => {
    if (0 === a) return '0 Bytes';
    
    const cacheKey = `${a}_${b}`;
    if (formatCache.has(cacheKey)) {
        return formatCache.get(cacheKey);
    }

    const c = 0 > b ? 0 : b,
        d = Math.floor(Math.log(a) / Math.log(1024));
    const result = (
        parseFloat((a / Math.pow(1024, d)).toFixed(c)) +
        ' ' +
        ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d]
    );
    
    // Cache result
    formatCache.set(cacheKey, result);
    
    // Limit cache size
    if (formatCache.size > 1000) {
        const firstKey = formatCache.keys().next().value;
        formatCache.delete(firstKey);
    }
    
    return result;
};
