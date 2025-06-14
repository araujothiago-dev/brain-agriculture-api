import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProdutoresService } from './produtores.service';
import { Produtor } from '../entities/produtor.entity';

describe('ProdutorService', () => {
  let service: ProdutoresService;
  let repository: Repository<Produtor>;

  const mockRepo = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockProdutor = {
    id: 1,
    nome: 'João Silva',
    cpfCnpj: '12345678900',
    idPublic: 'uuid-1234',
    ativo: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoresService,
        {
          provide: getRepositoryToken(Produtor),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ProdutoresService>(ProdutoresService);
    repository = module.get(getRepositoryToken(Produtor));
  });

  it('deve retornar todos os produtores', async () => {
    mockRepo.find.mockResolvedValue([mockProdutor]);
    const result = await service.findAll(1, 10, 'João');
    expect(result).toEqual([mockProdutor]);
  });

  it('deve retornar um produtor por ID', async () => {
    mockRepo.findOneBy.mockResolvedValue(mockProdutor);
    const result = await service.findOne('1');
    expect(result).toEqual(mockProdutor);
  });
});