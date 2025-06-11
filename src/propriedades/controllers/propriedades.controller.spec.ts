import { Test, TestingModule } from '@nestjs/testing';
import { PropriedadesController } from '../propriedades.controller';
import { PropriedadesService } from '../services/propriedades.service';

describe('PropriedadesController', () => {
  let controller: PropriedadesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropriedadesController],
      providers: [PropriedadesService],
    }).compile();

    controller = module.get<PropriedadesController>(PropriedadesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
