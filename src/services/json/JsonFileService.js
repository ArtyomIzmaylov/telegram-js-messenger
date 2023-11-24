const fs = require('fs')
const {json} = require("express");

class JsonFileService {

    constructor(path) {
        this.filePath = path;
    }

    readStringSession() {
        try {
            // Чтение файла синхронно
            console.log(this.filePath)
            const fileContent = fs.readFileSync(this.filePath, 'utf8');
            const jsonData = JSON.parse(fileContent);
            // Возвращаем значение stringSession или "DEFAULT" по умолчанию
            return jsonData.stringSession;
        } catch (error) {
            console.error(`Ошибка при чтении или парсинге файла JSON по пути ${this.filePath}:`, error);
            // Если произошла ошибка, возвращаем "DEFAULT"
            return "DEFAULT";
        }
    }
    writeStringSession(newStringSession) {
        try {
            const jsonData = { stringSession: newStringSession };
            const jsonString = JSON.stringify(jsonData);
            fs.writeFileSync(this.filePath, jsonString, 'utf8');
            console.log(`Сессия успешно записана в файл по пути ${this.filePath}`);
        } catch (error) {
            console.error(`Ошибка при записи сессии в файл по пути ${this.filePath}:`, error);
        }
    }
}



module.exports = JsonFileService
