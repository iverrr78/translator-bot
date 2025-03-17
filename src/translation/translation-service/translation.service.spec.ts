import { Test, TestingModule } from '@nestjs/testing';
import { TranslationServiceService } from './translation.service';

describe('TranslationServiceService', () => {
  let service: TranslationServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TranslationServiceService],
    }).compile();

    service = module.get<TranslationServiceService>(TranslationServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
