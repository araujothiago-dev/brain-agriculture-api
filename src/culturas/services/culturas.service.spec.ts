import { Test } from "@nestjs/testing";
import { CulturasService } from "./culturas.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Cultura } from "../entities/cultura.entity";


describe('CulturaService', () => {
  let service: CulturasService;
  const mockRepo = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  const mockCultura = {
    id: 1,
    nome: 'Soja',
    idPublic: 'uuid-cultura-001',
    ativo: true,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CulturasService,
        {
          provide: getRepositoryToken(Cultura),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = moduleRef.get<CulturasService>(CulturasService);
  });

  it('deve retornar todas as culturas', async () => {
    mockRepo.find.mockResolvedValue([mockCultura]);
    const result = await service.findAll(1, 10);
    expect(result).toEqual([mockCultura]);
  });

  it('deve retornar uma cultura por ID', async () => {
    mockRepo.findOneBy.mockResolvedValue(mockCultura);
    const result = await service.findOne('1');
    expect(result).toEqual(mockCultura);
  });
});
