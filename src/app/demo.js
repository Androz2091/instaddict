import { formatBytes } from "./helpers";
import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator';

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const demoUserObject = {
    id: 422820341791064085,
    username: 'Wumpus',
    discriminator: '0000',
    avatar: null
};

const getDaysRange = (start, end) => {
    for(var arr = [], date = new Date(start); date <= end; date.setDate(date.getDate()+1)){
        arr.push(new Date(date));
    }
    return arr;
};
    
export default () => {

    const removeAnalytics = window.location.href.includes('noanalytics');

    return {
        isDemo: true,

        favoriteWords: [
            { word: 'Instagram', count: 10000 },
            { word: 'addicted', count: 5000 }
        ],

        totalUserCount: randomNumber(10, 20),
        totalMessageCount: randomNumber(200, 500),
        totalVoiceMessagesMinutes: randomNumber(3, 10),
        totalLikedMessageCount: randomNumber(200, 300),
        totalPhotoCountSent: randomNumber(5, 20),
        totalStoryCountSent: randomNumber(4, 10),

        totalPhotoCountReceived: randomNumber(3, 10),
        totalMessageCountReceived: randomNumber(300, 400),
        totalVoiceMessagesMinutesReceived: randomNumber(2, 10),

        totalPollAnsweredCount: randomNumber(3, 10),
        totalPasswordChangeCount: randomNumber(1, 2),
        totalLoginCount: randomNumber(3, 10),
        totalLogoutCount: randomNumber(3, 10),

        totalPhotoSize: formatBytes(randomNumber(5_000_000, 10_000_000)),
        totalVoiceMessagesSize: formatBytes(randomNumber(3_000_000, 4_000_000)),
        totalMediaSize: formatBytes(randomNumber(10_000_000, 20_000_000)),

        hoursValues: new Array(24).fill(0).map(() => randomNumber(10, 1000)),
        messagesMonths: {
            monthsLabels: new Array(12).fill(0).map((v, i) => `${(i+1).toString().padStart(2, '0')}/${new Date().getFullYear()}`),
            monthsValues: new Array(12).fill(0).map(() => randomNumber(300, 500))
        },
        topGroups: new Array(20).fill(0).map((e) => ({
            name: uniqueNamesGenerator({
                dictionaries: [colors, animals, adjectives],
                length: 3,
                separator: '',
                style: 'capital'
            }),
            messageCount: randomNumber(100, 1000)
        })),
        topActiveGroups: new Array(20).fill(0).map((e) => ({
            name: uniqueNamesGenerator({
                dictionaries: [colors, animals, adjectives],
                length: 3,
                separator: '',
                style: 'capital'
            }),
            sentMessageCount: randomNumber(100, 1000)
        })),
        followersLabels: getDaysRange(new Date('2020-01-01'), new Date()),
        followersValues: new Array(getDaysRange(new Date('2020-01-01'), new Date()).length).fill(0).reduce((p, c) => {
            const currentValue = p[p.length-1];
            if (randomNumber(0, 5) === 3) {
                p.push(currentValue + 1);
            } else p.push(currentValue);
            return p;
        }, [0]),

        profilePicture: null,
        username: 'Simon'
    };
};
