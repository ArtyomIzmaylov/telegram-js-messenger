class MessageService {
    constructor(telegramMessageService ) {
        this.telegramMessageService = telegramMessageService
    }
    async create(data){
        await this.telegramMessageService.sendMessage(data)
    }
}


module.exports = MessageService
