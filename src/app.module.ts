import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { TranslationModule} from './translation/translation.module';

@Module({
  imports: [TelegramModule, TranslationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
