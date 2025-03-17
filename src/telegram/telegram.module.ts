import { Module } from '@nestjs/common';
import { TelegramService } from './telegram-service/telegram.service';
import { TranslationModule } from 'src/translation/translation.module';

@Module({
  providers: [TelegramService],
  imports: [TranslationModule],
})
export class TelegramModule {}
