import axios from 'axios';

export const getFavoriteWords = (words) => {
    words = words.flat(3);

    let item,
        length = words.length,
        array = [],
        object = {};

    for (let index = 0; index < length; index++) {
        item = words[index];
        if (!item) continue;

        if (!object[item]) object[item] = 1;
        else ++object[item];
    }

    for (let p in object) array[array.length] = p;

    return array
        .sort((a, b) => object[b] - object[a])
        .map((word) => ({ word: word, count: object[word] }))
        .slice(0, 10);
};

export const formatBytes = (a, b = 2) => {
    if (0 === a) return '0 Bytes';
    const c = 0 > b ? 0 : b,
        d = Math.floor(Math.log(a) / Math.log(1024));
    return (
        parseFloat((a / Math.pow(1024, d)).toFixed(c)) +
        ' ' +
        ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d]
    );
};
