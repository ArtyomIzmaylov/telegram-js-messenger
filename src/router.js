
const express = require('express');

const MessageController = require("./controllers/MessageController");

const MessageService = require("./services/telegram/TelegramMessageService");
const TelegramMessageService = require("./services/telegram/TelegramMessageService");
const {appCredentials} = require("./config");
const JsonFileService = require("./services/json/JsonFileService");



const router = express.Router();



router.post('/sendMessage', (req, res) => {
    new MessageController(new TelegramMessageService(appCredentials, new JsonFileService(appCredentials.sessionFilePath).readStringSession())).create(req,res)
})

module.exports = router
