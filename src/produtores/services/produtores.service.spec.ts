import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoresService } from '../produtor.service';

describe('ProdutoresService', () => {
  let service: ProdutoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProdutoresService],
    }).compile();

    service = module.get<ProdutoresService>(ProdutoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
