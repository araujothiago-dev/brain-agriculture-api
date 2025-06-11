import { Test, TestingModule } from '@nestjs/testing';
import { SafrasService } from './safras.service';

describe('SafrasService', () => {
  let service: SafrasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SafrasService],
    }).compile();

    service = module.get<SafrasService>(SafrasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
