import { TranslationService } from 'src/translation/translation-service/translation.service';
export declare class TelegramService {
    private readonly translationService;
    private BOT_TOKEN;
    private offset;
    private languageMap;
    constructor(translationService: TranslationService);
    private fetchUpdates;
    getMessage(): Promise<void>;
    processMessage(message: any): Promise<void>;
    sendInitialOptions(message: any): Promise<void>;
    sendMessage(chat_id: number, text: string): Promise<import("axios").AxiosResponse<any, any>>;
    startPolling(): Promise<void>;
    onModuleInit(): Promise<void>;
}
