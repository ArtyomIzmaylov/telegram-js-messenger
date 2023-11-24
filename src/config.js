const path = require('path');
const dotenvPath = path.resolve(__dirname, '../','.env'); // Замените 'config' на ваш путь
require('dotenv').config({ path: dotenvPath });


const sessionPath = path.resolve(__dirname, '..', 'db/session.json'); // Замените 'config' на ваш путь

console.log(sessionPath)

const appCredentials = {
    apiId : parseInt(process.env.API_ID, 10),
    apiHash : process.env.API_HASH,
    mainPhone : process.env.MAIN_PHONE,
    secretKey : process.env.SECRET_KEY,
    botToken : process.env.BOT_TOKEN,
    botMessage : 'Нужно авторизовать приложение, пожалуйста авторизуй',
    botRecipient : process.env.BOT_RECIPIEENT,
    sessionFilePath : path.resolve(__dirname, '../', 'db/session.json')
}




module.exports = {appCredentials}
