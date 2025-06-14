import { Test } from "@nestjs/testing";
import { SafrasService } from "./safras.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Safra } from "../entities/safra.entity";

describe('SafraService', () => {
  let service: SafrasService;
  const mockRepo = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  const mockSafra = {
    id: 1,
    nome: 'Safra 2024/2025',
    anoInicio: 2024,
    anoFim: 2025,
    idPublic: 'uuid-safra-001',
    ativo: true,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SafrasService,
        {
          provide: getRepositoryToken(Safra),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = moduleRef.get<SafrasService>(SafrasService);
  });

  it('deve retornar todas as safras', async () => {
    mockRepo.find.mockResolvedValue([mockSafra]);
    const result = await service.findAll(1, 10);
    expect(result).toEqual([mockSafra]);
  });

  it('deve retornar uma safra por ID', async () => {
    mockRepo.findOneBy.mockResolvedValue(mockSafra);
    const result = await service.findOne('1');
    expect(result).toEqual(mockSafra);
  });
});