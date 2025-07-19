import { DecodeUTF8 } from 'fflate';
import { formatBytes, getFavoriteWords } from './helpers';
import { loadTask } from './store';
import PQueue from 'p-queue';

export async function extractData(files) {
    const queue = new PQueue({
        concurrency: 3,
        intervalCap: 10,
        interval: 100
    });

    const getFile = (name) => files.find((file) => file.name === name);

    const getVideoDuration = (file) => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';

            video.onloadedmetadata = function () {
                window.URL.revokeObjectURL(video.src);
                resolve(video.duration);
            };

            video.src = URL.createObjectURL(file);
        });
    };

    const readFile = (name) => {
        return new Promise((resolve) => {
            const file = getFile(name);
            if (!file) return resolve(null);
            const fileContent = [];
            const decoder = new DecodeUTF8();
            file.ondata = (err, data, final) => {
                if (err) {
                    console.warn(`Error reading file ${name}:`, err);
                    return resolve(null);
                }
                decoder.push(data, final);
            };
            decoder.ondata = (str, final) => {
                fileContent.push(str);
                if (final) {
                    const result = fileContent.join('');
                    fileContent.length = 0;
                    resolve(result);
                }
            };
            file.start();
        });
    };

    const readBlobFile = (name) => {
        return new Promise((resolve) => {
            const file = getFile(name);
            if (!file) return resolve(null);
            const fileContents = [];
            file.ondata = (err, data, final) => {
                if (err) {
                    console.warn(`Error reading blob file ${name}:`, err);
                    return resolve(null);
                }
                fileContents.push(data);
                if (final) {
                    const blob = new Blob(fileContents);
                    fileContents.length = 0;
                    resolve(blob);
                }
            };
            file.start();
        });
    };

    const readImageFile = (name) => {
        return new Promise((resolve) => {
            const file = getFile(name);
            if (!file) return resolve(null);
            const fileContents = [];
            file.ondata = (err, data, final) => {
                fileContents.push(data);
                if (final) {
                    const binstr = fileContents
                        .map((c) =>
                            Array.prototype.map
                                .call(c, function (ch) {
                                    return String.fromCharCode(ch);
                                })
                                .join('')
                        )
                        .join('');
                    resolve(btoa(binstr));
                }
            };
            file.start();
        });
    };

    const extractedData = {
        mostUsedWords: [],

        totalUserCount: 0,
        totalMessageCount: 0,
        totalVoiceMessagesMinutes: 0,
        totalLikedMessageCount: 0,
        totalPhotoCountSent: 0,
        totalStoryCountSent: 0,

        totalPhotoCountReceived: 0,
        totalMessageCountReceived: 0,
        totalVoiceMessagesMinutesReceived: 0,

        totalPollAnsweredCount: 0,
        totalChangePasswordCount: 0,
        totalLoginCount: 0,
        totalLogoutCount: 0,

        totalPhotoSize: 0,
        totalVoiceMessagesSize: 0,
        totalMediaSize: 0,

        hoursValues: [],
        messagesMonths: [],
        topGroups: [],
        followersLabels: [],
        followersValues: [],

        profilePicture: null,
        username: null,
    };

    let firstMessage = Date.now();
    const users = new Set();
    const chatsData = [];
    let username;
    let totalVoiceMessagesSeconds = 0;
    let totalVoiceMessagesSecondsReceived = 0;
    let totalPhotoSize = 0;
    let totalVoiceMessagesSize = 0;

    const chatRegex =
        /^your_instagram_activity\/messages\/inbox\/([0-9a-z_]+)\/message_([0-9]+)\.json$/;
    const chats = [...new Set(files
        .filter((f) => chatRegex.test(f.name))
        .map((f) => f.name.match(chatRegex)[1]))];

    loadTask.set('Loading user messages...');

    const processChatBatch = async (chatBatch) => {
        const chatPromises = chatBatch.map(async (chat) => {
            const messageRegex = /message_([0-9]+)\.json$/;
            const messageIndexes = files
                .filter(
                    (f) =>
                        f.name.startsWith(
                            `your_instagram_activity/messages/inbox/${chat}`
                        ) && messageRegex.test(f.name)
                )
                .map((f) => f.name.match(messageRegex)[1]);

            const chatData = {
                name: null,
                isGroup: null,
                messageCount: 0,
                sentMessageCount: 0,
                messages: [],
            };

            for (const messageIndex of messageIndexes) {
                try {
                    const messageFileContent = await readFile(
                        `your_instagram_activity/messages/inbox/${chat}/message_${messageIndex}.json`
                    );
                    if (!messageFileContent) continue;
                    const content = JSON.parse(messageFileContent);

                    if (!username && content.participants.length === 2) {
                        username = content.participants[1].name;
                    } else if (!username && content.participants.length > 2) {
                        username = content.participants[0].name;
                    }

                    chatData.isGroup = content.participants.length > 2;
                    chatData.messageCount += content.messages.length;
                    chatData.name = decodeURIComponent(escape(content.title));

                    const messagePromises = content.messages.map(async (message) => {
                        users.add(message.sender_name);

                        if (message.reactions?.some(react => react.actor === username)) {
                            extractedData.totalLikedMessageCount++;
                        }

                        if (message.sender_name === username) {
                            chatData.sentMessageCount++;
                            if (message.timestamp_ms < firstMessage) {
                                firstMessage = message.timestamp_ms;
                            }
                            chatData.messages.push({
                                content: message.content,
                                timestamp: message.timestamp_ms,
                            });
                        } else {
                            extractedData.totalMessageCountReceived++;
                        }

                        if (message.audio_files && message.audio_files[0].uri.startsWith('your_instagram_activity/messages')) {
                            try {
                                const file = await readBlobFile(message.audio_files[0].uri);
                                if (file) {
                                    const duration = await getVideoDuration(file);
                                    if (message.sender_name === username) {
                                        totalVoiceMessagesSize += file.size;
                                        totalVoiceMessagesSeconds += duration;
                                    } else {
                                        totalVoiceMessagesSecondsReceived += duration;
                                    }
                                }
                            } catch (error) {
                                console.warn('Error processing audio file:', error);
                            }
                        } else if (message.photos) {
                            if (message.sender_name === username) {
                                extractedData.totalPhotoCountSent++;
                            } else {
                                extractedData.totalPhotoCountReceived++;
                            }

                            try {
                                const file = await readBlobFile(message.photos[0]?.uri);
                                if (file) {
                                    totalPhotoSize += file.size;
                                }
                            } catch (error) {
                                console.warn('Error processing photo file:', error);
                            }
                        }
                    });
                    
                    await Promise.all(messagePromises);
                } catch (error) {
                    console.warn(`Error processing message file ${messageIndex}:`, error);
                }
            }
            
            return chatData;
        });
        
        return Promise.all(chatPromises);
    };
    
    // Process chats in batches to avoid overwhelming the system
    const batchSize = 5;
    for (let i = 0; i < chats.length; i += batchSize) {
        const chatBatch = chats.slice(i, i + batchSize);
        const batchResults = await processChatBatch(chatBatch);
        chatsData.push(...batchResults);
        
        loadTask.set(
            `Loading messages... ${Math.ceil(
                (Math.min(i + batchSize, chats.length) / chats.length) * 100
            )}%`
        );
    }

    loadTask.set('Calculating messages statistics...');

    extractedData.username = username;
    extractedData.totalUserCount = users.size;
    extractedData.totalVoiceMessagesMinutes = Math.ceil(
        totalVoiceMessagesSeconds / 60
    );
    extractedData.totalVoiceMessagesMinutesReceived = Math.ceil(
        totalVoiceMessagesSecondsReceived / 60
    );

    const messages = chatsData.map((chat) => chat.messages).flat();
    extractedData.totalMessageCount = messages.length;

    const wordCounts = new Map();
    const minWordLength = 3; // Reduced for Turkish language
    
    // Filter out attachment messages and system messages
    const attachmentRegex = /sent an attachment\.|shared a post\.|shared a story\./i;
    
    for (const message of messages) {
        if (!message.content || attachmentRegex.test(message.content)) continue;
        
        const words = message.content.split(/\s+/);
        for (const word of words) {
            if (word.length > minWordLength) {
                // Clean word but preserve Turkish characters
                const cleanWord = word.toLowerCase()
                    .replace(/[^\wçğıöşüÇĞIİÖŞÜ]/g, '')
                    .replace(/^[0-9]+$/, ''); // Remove pure numbers
                
                if (cleanWord.length > minWordLength && cleanWord.length < 20) {
                    wordCounts.set(cleanWord, (wordCounts.get(cleanWord) || 0) + 1);
                }
            }
        }
    }
    
    extractedData.favoriteWords = Array.from(wordCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word, count]) => ({
            word: decodeURIComponent(escape(word)),
            count
        }));

    extractedData.totalPhotoSize = formatBytes(totalPhotoSize);
    extractedData.totalVoiceMessagesSize = formatBytes(totalVoiceMessagesSize);

    loadTask.set('Loading poll activities...');

    const pollsRegex = /^your_instagram_activity\/story_interactions\/polls(_[0-9]+)?\.json$/;
    const pollsFiles = files
        .filter((f) => pollsRegex.test(f.name))
        .map((f) => f.name);
    
    let totalPollAnsweredCount = 0;
    for (const pollsFile of pollsFiles) {
        try {
            const polls = JSON.parse(await readFile(pollsFile));
            totalPollAnsweredCount += polls?.story_activities_polls?.length || 0;
        } catch (error) {
            console.warn(`Error processing polls file ${pollsFile}:`, error);
        }
    }
    extractedData.totalPollAnsweredCount = totalPollAnsweredCount;

    loadTask.set('Loading security analytics...');

    const passwordChangeActivity = JSON.parse(
        await readFile(
            'security_and_login_information/login_and_profile_creation/password_change_activity.json'
        )
    );
    extractedData.totalPasswordChangeCount =
        passwordChangeActivity?.account_history_password_change_history
            .length || 0;

    const loginActivity = JSON.parse(
        await readFile(
            'security_and_login_information/login_and_profile_creation/login_activity.json'
        )
    );
    extractedData.totalLoginCount =
        loginActivity?.account_history_login_history.length || 0;

    const logoutActivity = JSON.parse(
        await readFile(
            'security_and_login_information/login_and_profile_creation/logout_activity.json'
        )
    );
    extractedData.totalLogoutCount =
        logoutActivity?.account_history_logout_history.length || 0;

    loadTask.set('Loading profile picture...');

    const profilePicture = JSON.parse(
        await readFile('your_instagram_activity/media/profile_photos.json')
    );
    if (profilePicture) {
        const picture = await readImageFile(
            profilePicture.ig_profile_picture[0].uri
        );
        extractedData.profilePicture = picture;
    }

    loadTask.set('Loading ecology analytics...');

    const mediaRegex = /^media\/[a-z]+\/[0-9]+\/([a-z0-9_.]+)$/;
    const medias = files
        .filter((f) => mediaRegex.test(f.name))
        .map((f) => f.name);
    let totalMediaSize = 0;
    await Promise.all(
        medias.map((media) => {
            return new Promise((resolve) => {
                readBlobFile(media).then((file) => {
                    totalMediaSize += file.size;
                    resolve();
                });
            });
        })
    );
    extractedData.totalMediaSize = formatBytes(totalMediaSize);

    loadTask.set('Loading stories...');

    const stories = JSON.parse(await readFile('your_instagram_activity/media/stories.json'));
    if (stories) {
        extractedData.totalStoryCountSent = stories.ig_stories.length;
    }

    loadTask.set('Loading quiz activities...');

    const quizzesRegex = /^your_instagram_activity\/story_interactions\/quizzes(_[0-9]+)?\.json$/;
    const quizzesFiles = files
        .filter((f) => quizzesRegex.test(f.name))
        .map((f) => f.name);
    
    let totalQuizAnsweredCount = 0;
    for (const quizzesFile of quizzesFiles) {
        try {
            const quizzes = JSON.parse(await readFile(quizzesFile));
            totalQuizAnsweredCount += quizzes?.story_activities_quizzes?.length || 0;
        } catch (error) {
            console.warn(`Error processing quizzes file ${quizzesFile}:`, error);
        }
    }
    extractedData.totalQuizAnsweredCount = totalQuizAnsweredCount;

    loadTask.set('Loading liked posts...');

    const likedPostsRegex = /^your_instagram_activity\/likes\/liked_posts(_[0-9]+)?\.json$/;
    const likedPostsFiles = files
        .filter((f) => likedPostsRegex.test(f.name))
        .map((f) => f.name);
    
    let totalLikedPostsCount = 0;
    for (const likedPostsFile of likedPostsFiles) {
        try {
            const likedPosts = JSON.parse(await readFile(likedPostsFile));
            totalLikedPostsCount += likedPosts?.likes_media_likes?.length || 0;
        } catch (error) {
            console.warn(`Error processing liked posts file ${likedPostsFile}:`, error);
        }
    }
    extractedData.totalLikedPostsCount = totalLikedPostsCount;

    loadTask.set('Loading post comments...');

    const commentRegex = /^your_instagram_activity\/comments\/post_comments_([0-9]+)\.json$/;
    const commentFiles = files
        .filter((f) => commentRegex.test(f.name))
        .map((f) => f.name);
    
    let totalCommentsCount = 0;
    for (const commentFile of commentFiles) {
        try {
            const postComments = JSON.parse(await readFile(commentFile));
            totalCommentsCount += postComments?.length || 0;
        } catch (error) {
            console.warn(`Error processing comment file ${commentFile}:`, error);
        }
    }
    extractedData.totalCommentsCount = totalCommentsCount;



    loadTask.set('Loading charts...');

    const allMessages = chatsData.map((c) => c.messages).flat();

    const hourCounts = new Array(24).fill(0);
    for (const message of allMessages) {
        const hour = new Date(message.timestamp).getHours();
        hourCounts[hour]++;
    }
    extractedData.hoursValues = hourCounts;

    const monthCounts = new Map();
    const formatMonthDate = (date) =>
        `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    
    for (const message of allMessages) {
        const monthKey = formatMonthDate(new Date(message.timestamp));
        monthCounts.set(monthKey, (monthCounts.get(monthKey) || 0) + 1);
    }
    
    const monthsLabels = [];
    const monthsValues = [];
    for (
        let i = new Date(firstMessage);
        i.getTime() <= Date.now();
        i.setMonth(i.getMonth() + 1)
    ) {
        const monthKey = formatMonthDate(i);
        monthsLabels.push(monthKey);
        monthsValues.push(monthCounts.get(monthKey) || 0);
    }

    extractedData.messagesMonths = {
        monthsLabels,
        monthsValues,
    };

    const topGroups = chatsData
        .sort((a, b) => b.messageCount - a.messageCount)
        .slice(0, 10);
    extractedData.topGroups = topGroups.map((group) => ({
        name: group.name,
        messageCount: group.messageCount,
    }));

    const topActiveGroups = chatsData
        .sort((a, b) => b.sentMessageCount - a.sentMessageCount)
        .slice(0, 10);
    extractedData.topActiveGroups = topActiveGroups.map((group) => ({
        name: group.name,
        sentMessageCount: group.sentMessageCount,
    }));

    const followerRegex = /^connections\/followers_and_following\/followers(_[0-9]+)?\.json$/;
    const followerFiles = files
        .filter((f) => followerRegex.test(f.name))
        .map((f) => f.name);
    
    let allFollowers = [];
    for (const followerFile of followerFiles) {
        try {
            const followerData = JSON.parse(await readFile(followerFile));
            if (followerData.relationships_followers) {
                allFollowers.push(...followerData.relationships_followers.map((f) => f.string_list_data[0]));
            } else if (Array.isArray(followerData)) {
                allFollowers.push(...followerData.map((f) => f.string_list_data[0]));
            }
        } catch (error) {
            console.warn(`Error processing follower file ${followerFile}:`, error);
        }
    }
    const firstFollowerTimestamp = allFollowers.sort(
        (a, b) => a.timestamp - b.timestamp
    )[0].timestamp;
    const formatDayDate = (date) =>
        `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}/${date.getFullYear()}`;
    let followerCount = 0;
    extractedData.followersValues = [];
    for (
        let i = new Date(firstFollowerTimestamp * 1000);
        i.getTime() <= Date.now();
        i.setDate(i.getDate() + 1)
    ) {
        const followerDayCount = allFollowers.filter(
            (m) =>
                formatDayDate(new Date(m.timestamp * 1000)) === formatDayDate(i)
        ).length;
        extractedData.followersLabels.push(formatDayDate(i));
        followerCount += followerDayCount;
        extractedData.followersValues.push(followerCount);
    }

    return extractedData;
}
