import { Test, TestingModule } from '@nestjs/testing';
import { CulturasService } from './culturas.service';

describe('CulturasService', () => {
  let service: CulturasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CulturasService],
    }).compile();

    service = module.get<CulturasService>(CulturasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
