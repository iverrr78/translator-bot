"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const translation_service_1 = require("../../translation/translation-service/translation.service");
let TelegramService = class TelegramService {
    translationService;
    BOT_TOKEN = process.env.BOT_TOKEN;
    offset = 0;
    languageMap = {
        "es": "Spanish",
        "en": "English",
        "fr": "French",
        "de": "German",
    };
    constructor(translationService) {
        this.translationService = translationService;
    }
    async fetchUpdates() {
        const response = await axios_1.default.get(`https://api.telegram.org/bot${this.BOT_TOKEN}/getUpdates`, { params: { offset: this.offset, timeout: 10 } });
        return response;
    }
    async getMessage() {
        const messages = await this.fetchUpdates();
        console.log("test1", messages.data.result);
        if (messages.data.result.length > 0) {
            this.offset = messages.data.result[0].update_id + 1;
            for (const update of messages.data.result) {
                await this.processMessage(update);
            }
        }
        return;
    }
    async processMessage(message) {
        console.log("test2");
        const chat_id = message.message.chat.id;
        if (message.message.text === '/start') {
            const initialresponse = this.sendInitialOptions(message);
            await axios_1.default.post(`https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`, {
                chat_id: chat_id,
                text: initialresponse,
            });
        }
        await this.sendMessage(chat_id, "mensaje");
        return;
    }
    async sendInitialOptions(message) {
        console.log("test4");
        const chat_id = message.message.chat.id;
        await this.sendMessage(chat_id, "I'm a transaltor bot. Send me a message and I'll translate it to Spanish.");
        const data = {
            chat_id: chat_id,
            text: "Choose a language to translate to:",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Spanish", callback_data: "es" }, { text: "English", callback_data: "en" }],
                    [{ text: "French", callback_data: "fr" }, { text: "German", callback_data: "de" }],
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
            },
        };
        await axios_1.default.post(`https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`, data);
        let user1 = false;
        const targetLanguage = await this.fetchUpdates();
        console.log("test6");
        return;
    }
    async sendMessage(chat_id, text) {
        return await axios_1.default.post(`https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`, {
            chat_id: chat_id,
            text: text
        });
    }
    async startPolling() {
        console.log('Bot started polling...');
        while (true) {
            try {
                await this.getMessage();
            }
            catch (error) {
                console.error('Error fetching updates:', error.message);
            }
        }
    }
    async onModuleInit() {
        this.startPolling();
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [translation_service_1.TranslationService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map