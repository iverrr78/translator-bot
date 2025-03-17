export declare class TranslationService {
    private HUGGINGFACE_TOKEN;
    private hf;
    private languagedetectionmodel;
    private translationmodel;
    identifyLanguage(message: string): Promise<import("@huggingface/tasks").TextClassificationOutput>;
    translateText(message: string, targetLanguage: string): Promise<import("@huggingface/tasks").TranslationOutput>;
}
