const {appCredentials} = require("../config");
const calculateHMAC = require("../services/crypto/CryptoService");


class MessageController {
    constructor(messageService) {
        this.messageService = messageService
    }
    async create(req, res)  {
        console.log(req.body)
        try {
            const hmacMessage = calculateHMAC(req.body.message, appCredentials.secretKey);
            const hmacPhone = calculateHMAC(req.body.phone, appCredentials.secretKey);
            if (hmacMessage !== req.body.hmacMessage || hmacPhone !== req.body.hmacPhone) {
                res.status(500).json({ error: 'Хэш не совпадает' });
            } else {
                const data = {
                    phone: req.body.phone,
                    message: req.body.message
                };
                console.log(data);
                const post = await this.messageService.sendMessage(data);
                res.json(post);
            }
        }
        catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }
}

module.exports = MessageController
