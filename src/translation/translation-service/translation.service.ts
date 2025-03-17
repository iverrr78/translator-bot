import { Injectable } from '@nestjs/common';
import { HfInference } from '@huggingface/inference';

@Injectable()
export class TranslationService {
    private HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN;
    private hf = new HfInference(this.HUGGINGFACE_TOKEN);
    private languagedetectionmodel = "papluca/xlm-roberta-base-language-detection";
    private translationmodel = "facebook/mbart-large-50-many-to-many-mmt";

    async identifyLanguage(message: string){
        return await this.hf.textClassification({
            model: this.languagedetectionmodel,
            inputs: message
        })
    }

    async translateText(message: string, targetLanguage: string){
        const originalLanguage = await this.identifyLanguage(message);
        return await this.hf.translation({
            model: this.translationmodel,
            inputs: message,
            timeout: 10000,
            parameters: {
                tgt_lang: "en",
                src_lang: "es"
            }
    })
}

}
