import { Test, TestingModule } from '@nestjs/testing';
import { SafrasService } from '../services/safras.service';
import { SafrasController } from './safras.controller';

describe('SafrasController', () => {
  let controller: SafrasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SafrasController],
      providers: [SafrasService],
    }).compile();

    controller = module.get<SafrasController>(SafrasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
