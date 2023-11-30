const {TelegramClient, Api} = require("telegram");
const {StringSession} = require("telegram/sessions");
const delaySend = require("../DelayService");

class TelegramMessageService {
    constructor(appCredentials, stringSession) {
        this.appCredentials = appCredentials
        this.stringSession = stringSession
    }
    async sendMessage(payload) {
        try {
            const { apiId, apiHash } = this.appCredentials;
            const stringSession = new StringSession(this.stringSession)
            const client = new TelegramClient(stringSession, apiId, apiHash, {
                connectionRetries: 5,
            });
            const { phone, message } = payload;
            await client.connect();
            const contactName = await client.invoke(
                new Api.contacts.ResolvePhone({
                    phone: phone,
                })
            );
            if (contactName.users && contactName.users.length > 0 && 'username' in contactName.users[0]) {
                console.log(contactName.users[0].id)
                await client.invoke(
                    new Api.contacts.AddContact({
                        id : contactName.users[0].id,
                        phone: phone,
                        firstName: contactName.users[0].firstName,
                        lastName: "",
                        addPhonePrivacyException: true,
                    })
                );
            }
            const entity = await client.getEntity(`+${phone}`);
            await delaySend(1000 * 20)
            await client.invoke(new Api.messages.SendMessage({
                peer: entity,
                message: message,
            }));
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
                if (error.message === 'Not a valid string' || error.message === '401: SESSION_REVOKED (caused by contacts.ResolvePhone)') {
                    fetch(`https://api.telegram.org/bot${this.appCredentials.botToken}/sendMessage`,{
                        method : 'post',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body : JSON.stringify({
                            chat_id: this.appCredentials.botRecipient,
                            text: this.appCredentials.botMessage,
                        })
                    })
                }
            }

        }
    }
}

module.exports = TelegramMessageService
