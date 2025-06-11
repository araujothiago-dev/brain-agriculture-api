import { Test, TestingModule } from '@nestjs/testing';
import { PropriedadesService } from '../propriedades.service';

describe('PropriedadesService', () => {
  let service: PropriedadesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropriedadesService],
    }).compile();

    service = module.get<PropriedadesService>(PropriedadesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
