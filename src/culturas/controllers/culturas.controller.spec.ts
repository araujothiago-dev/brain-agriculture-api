import { Test, TestingModule } from '@nestjs/testing';
import { CulturasService } from '../services/culturas.service';
import { CulturasController } from './culturas.controller';

describe('CulturasController', () => {
  let controller: CulturasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CulturasController],
      providers: [CulturasService],
    }).compile();

    controller = module.get<CulturasController>(CulturasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
