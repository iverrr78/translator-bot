import { Injectable } from '@nestjs/common';
import {OpenAI} from 'openai';

@Injectable()
export class TranslationService {
    //private OPENAI_TOKEN;
    private Client = new OpenAI({apiKey: process.env.OPENAI_TOKEN});

    /*constructor(){
        this.OPENAI_TOKEN = process.env.OPENAI_TOKEN;
        this.Client = new OpenAI({apiKey: this.OPENAI_TOKEN});
    }*/

    async translateText(message: string, targetLanguage: any){
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
        })

        console.log("translatedText:", translatedText.choices[0].message.content);

        return translatedText.choices[0].message.content;
    }

}
