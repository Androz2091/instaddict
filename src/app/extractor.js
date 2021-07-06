import { DecodeUTF8 } from 'fflate';
import { formatBytes, getFavoriteWords } from './helpers';
import { loadTask } from './store';
import PQueue from 'p-queue';

export async function extractData (files) {

    const queue = new PQueue({
        concurrency: 1
    });

    const getFile = (name) => files.find((file) => file.name === name);

    const getVideoDuration = (file) => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
        
            video.onloadedmetadata = function() {
        
                window.URL.revokeObjectURL(video.src);
                resolve(video.duration);
            }
        
            video.src = URL.createObjectURL(file);
        });
    }
    

    const readFile = (name) => {
        return new Promise((resolve) => {
            const file = getFile(name);
            if (!file) return resolve(null);
            const fileContent = [];
            const decoder = new DecodeUTF8();
            file.ondata = (err, data, final) => {
                decoder.push(data, final);
            };
            decoder.ondata = (str, final) => {
                fileContent.push(str);
                if (final) resolve(fileContent.join(''));
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
                fileContents.push(data);
                if (final) resolve(new Blob(fileContents));
            };
            file.start();
        });
    }

    const readImageFile = (name) => {
        return new Promise((resolve) => {
            const file = getFile(name);
            if (!file) return resolve(null);
            const fileContents = [];
            file.ondata = (err, data, final) => {
                fileContents.push(data);
                if (final) {
                    const binstr = fileContents.map((c) => Array.prototype.map.call(c, function (ch) {
                        return String.fromCharCode(ch);
                    }).join('')).join('');
                    resolve(btoa(binstr));
                }
            };
            file.start();
        });
    }

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
        username: null

    };

    let firstMessage = Date.now();
    const users = new Set();
    const chatsData = [];
    let username;
    let totalVoiceMessagesSeconds = 0;
    let totalVoiceMessagesSecondsReceived = 0;
    let totalPhotoSize = 0;
    let totalVoiceMessagesSize = 0;

    const chatRegex = /^messages\/inbox\/([0-9a-z_]+)\/message_1\.json$/;
    const chats = files.filter((f) => chatRegex.test(f.name)).map((f) => f.name.match(chatRegex)[1]);

    loadTask.set('Loading user messages...');
    
    await Promise.all(chats.map((chat) => {
        return new Promise((resolveChatPromise) => {

            const messageRegex = /message_([0-9]+)\.json$/;
            const messageIndexes = files
                .filter((f) => f.name.startsWith(`messages/inbox/${chat}`) && messageRegex.test(f.name))
                .map((f) => f.name.match(messageRegex)[1]);

            const chatData = {
                name: null,
                isGroup: null,
                messageCount: null,
                sentMessageCount: null,
                messages: []
            };

            Promise.all(messageIndexes.map((messageIndex) => {
                return new Promise((resolveMessagesPromise) => {
                    
                    readFile(`messages/inbox/${chat}/message_${messageIndex}.json`).then((messageFileContent) => {

                        const content = JSON.parse(messageFileContent);
                        
                        if (!username && content.participants.length === 2) username = content.participants[1].name;
                        else if (!username && content.participants.length > 2) username = content.participants[0].name;

                        chatData.isGroup = content.participants.length > 2;
                        chatData.messageCount += content.messages.length;
                        chatData.name = decodeURIComponent(escape(content.title));

                        Promise.all(
                            content.messages
                                .map((message) => {

                                    return new Promise((resolveMessagePromise) => {

                                        users.add(message.sender_name);

                                        if (message.reactions?.some((react) => react.actor === username)) extractedData.totalLikedMessageCount++;

                                        if (message.sender_name === username) {
                                            chatData.sentMessageCount++;
                                            if (message.timestamp_ms < firstMessage) firstMessage = message.timestamp_ms;
                                            chatData.messages.push({
                                                content: message.content,
                                                timestamp: message.timestamp_ms
                                            });
                                        } else {
                                            extractedData.totalMessageCountReceived++;
                                        }

                                        if (message.audio_files && message.audio_files[0].uri.startsWith('messages')) {

                                            queue.add(() => {
                                                return new Promise((resolveQueuePromise) => {
                                                    readBlobFile(message.audio_files[0].uri).then((file) => {

                                                        getVideoDuration(file).then((duration) => {
            
                                                            if (message.sender_name === username) {
                                                                totalVoiceMessagesSize += file.size;
                                                                totalVoiceMessagesSeconds += duration;
                                                            }
                                                            else totalVoiceMessagesSecondsReceived += duration;
                                                            resolveMessagePromise();
                                                            resolveQueuePromise();
            
                                                        });
                                                                                            
                                                    });
                                                });
                                            });

                                        }

                                        else if (message.photos) {

                                            if (message.sender_name === username) extractedData.totalPhotoCountSent++;
                                            else {
                                                extractedData.totalPhotoCountReceived++;
                                                resolveMessagePromise();
                                            }

                                            readBlobFile(message.photos[0].uri).then((file) => {

                                                totalPhotoSize += file.size;

                                                resolveMessagePromise();
                                            });
                                        } else resolveMessagePromise();

                                    });
                            })
                        ).then(() => {

                            resolveMessagesPromise();
                        });

                    });

                });
            })).then(() => {
                
                chatsData.push(chatData);
                loadTask.set(`Loading messages... ${Math.ceil(chatsData.length / chats.length * 100)}%`);
                resolveChatPromise();

            });

        });

    }));

    loadTask.set('Calculating messages statistics...');

    extractedData.username = username;
    extractedData.totalUserCount = users.size;
    extractedData.totalVoiceMessagesMinutes = Math.ceil(totalVoiceMessagesSeconds / 60);
    extractedData.totalVoiceMessagesMinutesReceived = Math.ceil(totalVoiceMessagesSecondsReceived / 60);

    const messages = chatsData.map((chat) => chat.messages).flat();
    extractedData.totalMessageCount = messages.length;

    const words = messages.filter((message) => message.content).map((message) => message.content.split(' ')).flat().filter((w) => w.length > 5);
    extractedData.favoriteWords = getFavoriteWords(words).map((w) => ({
        count: w.count,
        word: decodeURIComponent(escape(w.word))
    }));

    extractedData.totalPhotoSize = formatBytes(totalPhotoSize);
    extractedData.totalVoiceMessagesSize = formatBytes(totalVoiceMessagesSize);

    loadTask.set('Loading polls activities...');

    const polls = JSON.parse(await readFile('story_sticker_interactions/polls.json'));
    extractedData.totalPollAnsweredCount = polls?.story_activities_polls.length || 0;

    loadTask.set('Loading security analytics...');

    const passwordChangeActivity = JSON.parse(await readFile('login_and_account_creation/password_change_activity.json'));
    extractedData.totalPasswordChangeCount = passwordChangeActivity?.account_history_password_change_history.length || 0;

    const loginActivity = JSON.parse(await readFile('login_and_account_creation/login_activity.json'));
    extractedData.totalLoginCount = loginActivity?.account_history_login_history.length || 0;

    const logoutActivity = JSON.parse(await readFile('login_and_account_creation/logout_activity.json'));
    extractedData.totalLogoutCount = logoutActivity?.account_history_logout_history.length || 0;

    loadTask.set('Loading profile picture...');

    const profilePicture = JSON.parse(await readFile('content/profile_photos.json'));
    if (profilePicture) {
        const picture = await readImageFile(profilePicture.ig_profile_picture[0].uri);
        extractedData.profilePicture = picture;
    }

    loadTask.set('Loading ecology analytics...');

    const mediaRegex = /^media\/[a-z]+\/[0-9]+\/([a-z0-9_.]+)$/;
    const medias = files.filter((f) => mediaRegex.test(f.name)).map((f) => f.name);
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

    const stories = JSON.parse(await readFile('content/stories.json'));
    if (stories) {
        extractedData.totalStoryCountSent = stories.ig_stories.length;
    }

    loadTask.set('Loading charts...');

    const allMessages = chatsData.map((c) => c.messages).flat();

    for (let i = 0; i < 24; i++) {
        extractedData.hoursValues.push(allMessages.filter((m) => new Date(m.timestamp).getHours() === i).length);
    }

    const monthsLabels = [];
    const monthsValues = [];
    const formatMonthDate = (date) => `${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    for (let i = new Date(firstMessage); i.getTime() <= Date.now(); i.setMonth(i.getMonth() + 1)) {
        monthsLabels.push(formatMonthDate(i));
        monthsValues.push(allMessages.filter((m) => formatMonthDate(new Date(m.timestamp)) === formatMonthDate(i)).length);
    }

    extractedData.messagesMonths = {
        monthsLabels,
        monthsValues
    };

    const topGroups = chatsData.sort((a, b) => b.messageCount - a.messageCount).slice(0, 10);
    extractedData.topGroups = topGroups.map((group) => ({
        name: group.name,
        messageCount: group.messageCount
    }));

    const topActiveGroups = chatsData.sort((a, b) => b.sentMessageCount - a.sentMessageCount).slice(0, 10);
    extractedData.topActiveGroups = topActiveGroups.map((group) => ({
        name: group.name,
        sentMessageCount: group.sentMessageCount
    }));

    const followers = JSON.parse(await readFile('followers_and_following/followers.json'));
    const allFollowers = followers.relationships_followers.map((f) => f.string_list_data[0]);
    const formatDayDate = (date) => `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    let followerCount = 0;
    extractedData.followersValues = [];
    for (let i = new Date(firstMessage); i.getTime() <= Date.now(); i.setDate(i.getDate() + 1)) {
        const followerDayCount = allFollowers.filter((m) => formatDayDate(new Date(m.timestamp * 1000)) === formatDayDate(i)).length;
        extractedData.followersLabels.push(formatDayDate(i));
        followerCount += followerDayCount;
        extractedData.followersValues.push(followerCount);
    }

    return extractedData;

};
