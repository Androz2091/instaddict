import { DecodeUTF8 } from 'fflate';
import { getFavoriteWords } from './helpers';

export async function extractData (files) {

    const getFile = (name) => files.find((file) => file.name === name);

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

    const extractedData = {

        mostUsedWords: [],
        totalMessageCount: [],
        chats: []

    };

    let username;

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
                            .filter((m) => m.sender_name === username && m.content)
                            .forEach((message) => {

                                if (!message.content) console.log(message)

                                chatData.messages.push({
                                    content: message.content,
                                    timestamp: message.timestamp
                                });

                        });

                        Promise.all(
                            content.messages
                                .filter((m) => m.sender_name === username && m.audio_files)
                                .map((voiceMessage) => {

                                    return new Promise((resolveAudioMessagePromise) => {

                                        // todo read audio file

                                        resolveAudioMessagePromise();

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

    const messages = extractedData.chats.map((chat) => chat.messages).flat();
    extractedData.totalMessageCount = messages.length;

    const words = messages.map((message) => message.content.split(' ')).flat().filter((w) => w.length > 5);
    extractedData.favoriteWords = getFavoriteWords(words).map((w) => ({
        count: w.count,
        word: decodeURIComponent(escape(w.word))
    }));

    return extractedData;

};
