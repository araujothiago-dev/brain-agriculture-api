import { getRepositoryToken } from '@nestjs/typeorm';
import { PropriedadesService } from './propriedades.service';
import { Test } from '@nestjs/testing';
import { Propriedade } from '../entities/propriedade.entity';
import { DataSource, Repository } from 'typeorm';

describe('PropriedadeService', () => {
  let service: PropriedadesService;
  let repo: Repository<Propriedade>;

  const mockUsuarioProdutor = {
    id: 1,
    nome: 'João Silva Araujo',
    email: 'joaoaraujo@email.com',
    cpfCnpj: '89.209.082/0001-92',
    senha: '123456*An',
    perfil: {
      id: 2
    }
  };

  const mockProdutor = {
    id: 1,
    nome: 'João Silva Araujo',
    cpfCnpj: '89.209.082/0001-92',
    usuario: mockUsuarioProdutor
  };

  const mockCidadeRepository = {
    findOneBy: jest.fn().mockResolvedValue({ id: 1 }),
    findOne: jest.fn().mockResolvedValue({ id: 1 })
  };

  const mockProdutorRepository = {
    findOneBy: jest.fn().mockResolvedValue(mockProdutor),
    findOne: jest.fn().mockResolvedValue(mockProdutor)
  };

  const mockPropriedade = {
    nome: 'Fazenda Bela Vista',
    matricula: 123456,
    ativo: true,
    areaTotal: 100,
    areaAgricultavel: 80,
    areaVegetacao: 20,
    cidade: { id: 1 },
    produtor: mockProdutor
  };

  const mockRepository = {
    find: jest.fn().mockResolvedValue(null),
    findOne: jest.fn().mockResolvedValue(null),
    findOneBy: jest.fn().mockResolvedValue({ id: 1, ...mockPropriedade }),
    save: jest.fn().mockResolvedValue({ id: 1, ...mockPropriedade }),
    create: jest.fn().mockResolvedValue({ id: 1, ...mockPropriedade }),
    findAndCount: jest.fn().mockResolvedValue([[mockPropriedade], 1])
  };

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    getRepository: jest.fn((entity) => {
      if (entity.name === 'Municipio') return mockCidadeRepository;
      if (entity.name === 'Produtor') return mockProdutorRepository;
      return mockRepository;
    }),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PropriedadesService,
        {
          provide: getRepositoryToken(Propriedade),
          useValue: mockRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource
        }
      ],
    }).compile();

    service = module.get<PropriedadesService>(PropriedadesService);
    repo = module.get<Repository<Propriedade>>(getRepositoryToken(Propriedade));
  });

  it('deve criar uma nova propriedade', async () => {
    mockRepository.findOne = jest.fn().mockResolvedValue(null);
    const result = await service.create(mockPropriedade as any);
    expect(result).toEqual({
      data: {
        ...mockPropriedade,
        id: 1
      },
      error: null,
      message: "Ação realizada com sucesso."
    });
    expect(repo.save).toHaveBeenCalled();
  });

  it('deve retornar todas as propriedades', async () => {
    mockRepository.find.mockResolvedValue(null);
    const result = await service.findAll(10, 0, '');
    expect(result).toEqual(
      expect.objectContaining({
        data: {
          content: [
            expect.objectContaining({
              nome: 'Fazenda Bela Vista',
              matricula: 123456,
              ativo: true,
              areaTotal: 100,
              areaAgricultavel: 80,
              areaVegetacao: 20,
              cidade: { id: 1 },
              produtor: expect.objectContaining({
                id: 1,
                nome: 'João Silva Araujo',
                cpfCnpj: '89.209.082/0001-92',
              }),
            }),
          ],
          total: 1,
          totalPages: Infinity,
        },
        error: null,
        message: "Ação realizada com sucesso."
      })
    );
  });
});