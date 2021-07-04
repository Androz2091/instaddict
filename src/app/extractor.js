import { DecodeUTF8 } from 'fflate';
import { getFavoriteWords } from './helpers';

export async function extractData (files) {

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

    const readVideoFile = (name) => {
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

    const extractedData = {

        mostUsedWords: [],
        chats: [],

        totalUsers: 0,
        totalMessageCount: 0,
        totalVoiceMessagesMinutes: 0,

        totalMessageCountReceived: 0,
        totalVoiceMessagesMinutesReceived: 0,

        username: null

    };

    const users = new Set();
    let username;
    let totalVoiceMessagesSeconds = 0;
    let totalVoiceMessagesSecondsReceived = 0;

    const chatRegex = /^messages\/inbox\/([0-9a-z_]+)\/message_1\.json$/;
    const chats = files.filter((f) => chatRegex.test(f.name)).map((f) => f.name.match(chatRegex)[1]);
    
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

                        content.messages
                            .filter((m) => m.content)
                            .forEach((message) => {

                                users.add(message.sender_name);

                                if (message.sender_name === username) {
                                    chatData.messages.push({
                                        content: message.content,
                                        timestamp: message.timestamp
                                    });
                                } else {
                                    extractedData.totalMessageCountReceived++;
                                }
                        });

                        Promise.all(
                            content.messages
                                .filter((m) => m.audio_files && m.audio_files[0].uri.startsWith('messages'))
                                .map((voiceMessage) => {

                                    return new Promise((resolveAudioMessagePromise) => {

                                        readVideoFile(voiceMessage.audio_files[0].uri).then((file) => {

                                            getVideoDuration(file).then((duration) => {

                                                if (voiceMessage.sender_name === username) totalVoiceMessagesSeconds += duration;
                                                else totalVoiceMessagesSecondsReceived += duration;
                                                resolveAudioMessagePromise();

                                            });
                                                                                
                                        });

                                    });

                            })
                        ).then(() => {

                            extractedData.chats.push(chatData);

                            resolveMessagesPromise();
                        });

                    });

                });
            })).then(() => resolveChatPromise());

        });

    }));

    extractedData.username = username;
    extractedData.totalUsers = users.size;
    extractedData.totalVoiceMessagesMinutes = Math.ceil(totalVoiceMessagesSeconds / 60);
    extractedData.totalVoiceMessagesMinutesReceived = Math.ceil(totalVoiceMessagesSecondsReceived / 60);

    const messages = extractedData.chats.map((chat) => chat.messages).flat();
    extractedData.totalMessageCount = messages.length;

    const words = messages.map((message) => message.content.split(' ')).flat().filter((w) => w.length > 5);
    extractedData.favoriteWords = getFavoriteWords(words).map((w) => ({
        count: w.count,
        word: decodeURIComponent(escape(w.word))
    }));

    return extractedData;

};
