
const express = require('express')
const {appCredentials} = require("./config");
const mainBot = require("./services/bot/TelegramServiceBot");

const router = require('./router')
const PORT = 5000
const app = express()
app.use(express.json())
app.use('/api', router)

async function startApp() {
    try {
        app.listen(PORT, () => console.log('SERVER STARTED'))
        mainBot(appCredentials)
    }
    catch (error) {
        console.log(error)
    }
}

startApp()
