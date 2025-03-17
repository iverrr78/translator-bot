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
const inference_1 = require("@huggingface/inference");
let TranslationService = class TranslationService {
    HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN;
    hf = new inference_1.HfInference(this.HUGGINGFACE_TOKEN);
    languagedetectionmodel = "papluca/xlm-roberta-base-language-detection";
    translationmodel = "facebook/mbart-large-50-many-to-many-mmt";
    async identifyLanguage(message) {
        return await this.hf.textClassification({
            model: this.languagedetectionmodel,
            inputs: message
        });
    }
    async translateText(message, targetLanguage) {
        const originalLanguage = await this.identifyLanguage(message);
        return await this.hf.translation({
            model: this.translationmodel,
            inputs: message,
            timeout: 10000,
            parameters: {
                tgt_lang: "en",
                src_lang: "es"
            }
        });
    }
};
exports.TranslationService = TranslationService;
exports.TranslationService = TranslationService = __decorate([
    (0, common_1.Injectable)()
], TranslationService);
//# sourceMappingURL=translation.service.js.map