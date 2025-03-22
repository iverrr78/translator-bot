import { Injectable } from '@nestjs/common';
import axios  from 'axios';
import { TranslationService } from 'src/translation/translation-service/translation.service';

type chat = {
    user1: number;
    user2: number;
}

@Injectable()
export class TelegramService {
    private BOT_TOKEN = process.env.BOT_TOKEN;
    private offset: number = 0;
    private LanguageOptions = new Map<string, string>([
        ['es', 'Spanish'],
        ['en', 'English'],
        ['fr', 'French'],
        ['de', 'German'],
    ]);
    private targetLanguage: string;
    private chats = new Map<number, chat>();


    constructor(private readonly translationService: TranslationService) {}

    private async fetchUpdates() {
        const response = await axios.get(`https://api.telegram.org/bot${this.BOT_TOKEN}/getUpdates`, { params: { offset: this.offset, timeout: 10 } });
        return response;
    }
    
    async getMessage() {
        const messages = await this.fetchUpdates();

        if (messages.data.result.length > 0) {
            this.offset = messages.data.result[0].update_id + 1;
            for(const update of messages.data.result) {
                await this.processMessage(update);
            }
        }
        return;
    }

    async processMessage(message: any){
        const chat_id = message.message.chat.id;
        if(message.message.text === '/start') {
            await this.sendInitialOptions(message);
            return;
        }

        const translatedMessage = await this.translationService.translateText(message.message.text, this.targetLanguage);
        await this.sendMessage(chat_id, translatedMessage);
        return;
    }

    async sendInitialOptions(message: any) {
        const chat_id = message.message.chat.id;
        this.chats.set(chat_id, { user1: chat_id, user2: 0 });
        await this.sendMessage(chat_id, "I'm a transaltor bot. Send me a message and I'll translate it to Spanish.");
        const data = {
            chat_id: chat_id,
            text: "Choose a language to translate to:",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Spanish", callback_data: "Spanish" }, { text: "English", callback_data: "English" }],
                    [{ text: "French", callback_data: "French" }, { text: "German", callback_data: "German" }],
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
            },
        }
        await axios.post(`https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`, data);
        let user1 = false;
        while(!user1){
            const updates = await this.fetchUpdates();

        if (updates.data.result.length > 0) {
            this.targetLanguage = updates.data.result[0].callback_query.data;       
            this.offset = updates.data.result[0].update_id + 1;
            user1 = true;
        }
        }

        return;
    }
    async sendMessage(chat_id: number, text: any) {
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
