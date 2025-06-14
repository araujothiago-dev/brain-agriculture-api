import { getRepositoryToken } from '@nestjs/typeorm';
import { PropriedadesService } from './propriedades.service';
import { Test } from '@nestjs/testing';
import { Propriedade } from '../entities/propriedade.entity';

describe('PropriedadeService', () => {
  let service: PropriedadesService;
  const mockRepo = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  const mockPropriedade = {
    id: 1,
    nome: 'Fazenda Bela Vista',
    matricula: 123456,
    idPublic: 'uuid-9876',
    ativo: true,
    areaTotal: 100,
    areaAgricultavel: 80,
    areaVegetacao: 20,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PropriedadesService,
        {
          provide: getRepositoryToken(Propriedade),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = moduleRef.get<PropriedadesService>(PropriedadesService);
  });

  it('deve retornar todas as propriedades', async () => {
    mockRepo.find.mockResolvedValue([mockPropriedade]);
    const result = await service.findAll(1, 10, 'Fazenda');
    expect(result).toEqual([mockPropriedade]);
  });

  it('deve retornar uma propriedade por ID', async () => {
    mockRepo.findOneBy.mockResolvedValue(mockPropriedade);
    const result = await service.findOne('1');
    expect(result).toEqual(mockPropriedade);
  });
});