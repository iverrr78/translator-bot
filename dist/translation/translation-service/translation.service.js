"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("openai");
let TranslationService = class TranslationService {
    Client = new openai_1.OpenAI({ apiKey: process.env.OPENAI_TOKEN });
    async translateText(message, targetLanguage) {
        const translatedText = await this.Client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `Translate this text to ${targetLanguage}`
                },
                {
                    role: "user",
                    content: message
                }
            ]
        });
        console.log("translatedText:", translatedText.choices[0].message.content);
        return translatedText.choices[0].message.content;
    }
};
exports.TranslationService = TranslationService;
exports.TranslationService = TranslationService = __decorate([
    (0, common_1.Injectable)()
], TranslationService);
//# sourceMappingURL=translation.service.js.map