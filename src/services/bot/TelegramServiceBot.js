const TelegramBot = require('node-telegram-bot-api')
const {TelegramClient} = require("telegram");
const JsonFileService = require("../json/JsonFileService");
const {appCredentials} = require("../../config");
const {StringSession} = require("telegram/sessions");

const userStates = new Map();

async function waitForFirstMessage(bot, chatId) {
    if (userStates.get(chatId) === 'waitingForCode') {
        bot.sendMessage(chatId, 'Ожидаю код...');
        const messagePromise = new Promise((resolve) => {
            bot.once('message', (msg) => {
                if (msg.text && msg.text.trim() !== '') {
                    console.log(msg.text);
                    resolve(msg.text);
                }
            });
        });

        const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => {
                resolve('Не отправили');
                bot.removeAllListeners('message');
                userStates.delete(chatId);
            }, 1000 * 200);
        });

        return Promise.race([messagePromise, timeoutPromise]);
    } else {
        return 'Ошибка: ожидание кода не инициировано.';
    }
}


class TelegramAuthService {
    async authTelegramClient(bot, chatId, appCredentials) {
        const {apiId, apiHash, mainPhone} = appCredentials
        const stringSession = new StringSession('');
        console.log("Loading interactive example...");

        try {
            const client = new TelegramClient(stringSession, apiId, apiHash, {
                connectionRetries: 5,
            });
            await client.start({
                phoneNumber: mainPhone,
                phoneCode: async () => await waitForFirstMessage(bot, chatId),
                onError: (err) => {
                    console.log(err);
                    process.exit();
                },
            });

            console.log("You should now be connected.");
            console.log(client.session.save());
            const session = client.session.save();
            const jsonFileService = new JsonFileService(appCredentials.sessionFilePath);
            jsonFileService.writeStringSession(session);

            bot.sendMessage(chatId, 'Авторизация успешна.');

        } catch (error) {
            console.error(error);
            process.exit();
        }
    }
}

function mainBot(appCredentials) {
    const bot = new TelegramBot(appCredentials.botToken, {polling : true});
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start:impulse') {
            userStates.set(chatId, 'waitingForCode');
            const telegramAuthService = new TelegramAuthService();
            await telegramAuthService.authTelegramClient(bot, chatId, appCredentials);
        }
        await bot.sendMessage(chatId, 'привет')
    });
}

module.exports = mainBot
