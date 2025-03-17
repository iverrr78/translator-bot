import { Test, TestingModule } from '@nestjs/testing';
import { TelegramServiceService } from './telegram.service';

describe('TelegramServiceService', () => {
  let service: TelegramServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramServiceService],
    }).compile();

    service = module.get<TelegramServiceService>(TelegramServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
