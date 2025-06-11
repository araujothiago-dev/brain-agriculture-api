import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoresController } from './produtores.controller';
import { ProdutoresService } from '../services/produtores.service';

describe('ProdutoresController', () => {
  let controller: ProdutoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoresController],
      providers: [ProdutoresService],
    }).compile();

    controller = module.get<ProdutoresController>(ProdutoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
