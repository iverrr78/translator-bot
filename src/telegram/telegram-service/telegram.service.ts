import { Injectable } from '@nestjs/common';
import axios  from 'axios';
import { TranslationService } from 'src/translation/translation-service/translation.service';

type languageMap = { [key: string]: string };

@Injectable()
export class TelegramService {
    private BOT_TOKEN = process.env.BOT_TOKEN;
    private offset: number = 0;
    private languageMap: languageMap = {
        "es": "Spanish",
        "en": "English",
        "fr": "French",
        "de": "German",
    };

    constructor(private readonly translationService: TranslationService) {}

    private async fetchUpdates() {
        const response = await axios.get(`https://api.telegram.org/bot${this.BOT_TOKEN}/getUpdates`, { params: { offset: this.offset, timeout: 10 } });
        return response;
    }
    
    async getMessage() {
        const messages = await this.fetchUpdates();
        console.log("test1", messages.data.result);
        if (messages.data.result.length > 0) {
            this.offset = messages.data.result[0].update_id + 1;
            for(const update of messages.data.result) {
                await this.processMessage(update);
                //this.offset = update.update_id + 1;
            }
            //await this.processMessage(Messages.data.result[0]);
            //this.offset = Messages.data.result[0].update_id + 1;
        }
        return;
    }

    async processMessage(message: any){
        console.log("test2");
        const chat_id = message.message.chat.id;
        if(message.message.text === '/start') {
            /*console.log("test3");
            await axios.post(`https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`, {
                chat_id: chat_id,
                text: "start",
            });
            return;*/
            const initialresponse = this.sendInitialOptions(message);
            await axios.post(`https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`, {
                chat_id: chat_id,
                text: initialresponse,
            });
            /*return await axios.post(`https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`, {
                chat_id: chat_id,
                text: message.message.text
            });*/
        }
        //const translatedMessage = await this.translationService.translateText(message.text, "English");
        //console.log("translatedMessage:", translatedMessage.translation_text.slice(3));
        //await this.sendMessage(chat_id, translatedMessage.translation_text.slice(3));
        await this.sendMessage(chat_id, "mensaje");
        return;
    }

    async sendInitialOptions(message: any) {
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
        }
        await axios.post(`https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`, data);
        //this.offset = message.update_id + 1;
        let user1 = false;
        //var user2 = false;
        const targetLanguage = await this.fetchUpdates();
        console.log("targetLanguage:", targetLanguage.data.result[0].callback_query.data);
        while(!user1){
            console.log("test5");
            const updates = await this.fetchUpdates();
            console.log("updates:", updates.data.result[0].update_id);
            //console.log("updates:", updates.data.message.text);
        if (updates.data.length > 0) {
            targetLanguage = updates[0].callback_query.data;
            if (targetLanguage === "es") {
                user1 = true;
            }
            this.offset = updates.data.result[0].update_id + 1;
        }
        }

        console.log("test6");
        //const targetLanguage = await axios.get(`https://api.telegram.org/bot${this.BOT_TOKEN}/getUpdates`, { params: { offset: this.offset, timeout: 30 } });
        //console.log("targetLanguage:", targetLanguage.data.result);
        //return targetLanguage;
        return;
    }
    async sendMessage(chat_id: number, text: string) {
        return await axios.post(`https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`, {
            chat_id: chat_id,
            text: text
        });
    }

    async startPolling() {
        console.log('Bot started polling...');
        while (true) {
          try {
            await this.getMessage();
          } catch (error) {
            console.error('Error fetching updates:', error.message);
          }
        }
      }

    async onModuleInit() {
        this.startPolling();
    }
}
