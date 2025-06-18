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
    delete: jest.fn().mockResolvedValue({ id: 1, ...mockPropriedade }),
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
    mockQueryRunner.manager.save = jest.fn().mockResolvedValue({ ...mockPropriedade, id: 1 });
    mockQueryRunner.manager.findOne = jest.fn().mockResolvedValue({ ...mockPropriedade, id: 1 });
    const result = await service.create({ ...mockPropriedade, cidade: { id: 1 }, produtor: { id: 1 } } as any);
    expect(result).toEqual({
      data: {
        ...mockPropriedade,
        id: 1
      },
      error: null,
      message: "Ação realizada com sucesso."
    });
    expect(mockQueryRunner.manager.save).toHaveBeenCalled();
  });

  it('deve retornar todas as propriedades', async () => {
    mockRepository.findAndCount.mockResolvedValue([[{ ...mockPropriedade, id: 1 }], 1]);
    const result = await service.findAll(1, 10, '');
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
          totalPages: 1,
        },
        error: null,
        message: "Ação realizada com sucesso."
      })
    );
  });

  it('deve lançar erro ao criar propriedade com áreas inválidas', async () => {
    const invalidPropriedade = { ...mockPropriedade, areaAgricultavel: 90, areaVegetacao: 20, areaTotal: 100, cidade: { id: 1 }, produtor: { id: 1 } };
    await expect(service.create(invalidPropriedade as any)).rejects.toThrow('Não foi possível cadastrar a Propriedade.');
  });

  it('deve lançar erro ao criar propriedade com matrícula já existente', async () => {
    mockRepository.findOne = jest.fn().mockResolvedValue({ ...mockPropriedade });
    await expect(service.create({ ...mockPropriedade, cidade: { id: 1 }, produtor: { id: 1 } } as any)).rejects.toThrow('Não foi possível cadastrar a Propriedade.');
  });

  it('deve lançar erro ao criar propriedade com município inexistente', async () => {
    mockRepository.findOne = jest.fn().mockResolvedValue(null);
    mockCidadeRepository.findOne = jest.fn().mockResolvedValue(null);
    await expect(service.create({ ...mockPropriedade, cidade: { id: 99999 }, produtor: { id: 1 } } as any)).rejects.toThrow('Não foi possível cadastrar a Propriedade.');
  });

  it('deve lançar erro ao criar propriedade com produtor inexistente', async () => {
    mockRepository.findOne = jest.fn().mockResolvedValue(null);
    mockCidadeRepository.findOne = jest.fn().mockResolvedValue({ id: 1 });
    mockProdutorRepository.findOne = jest.fn().mockResolvedValue(null);
    await expect(service.create({ ...mockPropriedade, cidade: { id: 1 }, produtor: { id: 99999 } } as any)).rejects.toThrow('Não foi possível cadastrar a Propriedade.');
  });

  it('deve buscar uma propriedade pelo idPublic', async () => {
    mockRepository.findOne = jest.fn().mockResolvedValue({ id: 1, ...mockPropriedade });
    const result = await service.findOne('id-public-test');
    expect(result.data).toEqual(expect.objectContaining({ nome: 'Fazenda Bela Vista' }));
  });

  it('deve lançar erro ao buscar propriedade inexistente', async () => {
    mockRepository.findOne = jest.fn().mockResolvedValue(null);
    await expect(service.findOne('id-inexistente')).rejects.toThrow('Não foi possível buscar a Propriedade.');
  });

  it('deve remover uma propriedade', async () => {
    mockRepository.findOneBy = jest.fn().mockResolvedValue({ idPublic: 'id-public-test', ...mockPropriedade });
    mockRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });
    const result = await service.remove('id-public-test');
    expect(result.message).toContain('Propriedade deletada com sucesso');
  });

  it('deve lançar erro ao remover propriedade inexistente', async () => {
    mockRepository.findOneBy = jest.fn().mockResolvedValue(null);
    await expect(service.remove('id-inexistente')).rejects.toThrow('Não foi possível deletar a Propriedade.');
  });
});