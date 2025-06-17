import { Test } from "@nestjs/testing";
import { SafrasService } from "./safras.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Safra } from "../entities/safra.entity";
import { DataSource, Repository } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

describe('SafraService', () => {
  let service: SafrasService;
  let repo: Repository<Safra>;


  const mockSafra = { 
    nome: 'Safra 2022'
  }

  const mockRepository = {
    find: jest.fn().mockResolvedValue(null),
    findOne: jest.fn().mockResolvedValue(null),
    findOneBy: jest.fn().mockResolvedValue({ id: 1, ...mockSafra }),
    save: jest.fn().mockResolvedValue({ id: 1, ...mockSafra }),
    create: jest.fn().mockResolvedValue({ id: 1, ...mockSafra }),
    findAndCount: jest.fn().mockResolvedValue([[mockSafra], 1])
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SafrasService,
        {
          provide: getRepositoryToken(Safra),
          useValue: mockRepository,
        },
        {
          provide: DataSource,
          useValue: {
            getRepository: jest.fn().mockReturnValue(mockRepository),
          },
        }
      ],
    }).compile();

    service = module.get<SafrasService>(SafrasService);
    repo = module.get<Repository<Safra>>(getRepositoryToken(Safra));
  });

  it('deve criar uma nova Safra', async () => {
    const result = await service.create(mockSafra as any);
    expect(result).toEqual({
      data: {
        ...mockSafra,
        id: 1
      },
      error: null,
      message: "Ação realizada com sucesso."
    });
    expect(repo.save).toHaveBeenCalled();
  });

  it('deve retornar todas as safras', async () => {
    mockRepository.find.mockResolvedValue([mockSafra]);
    const result = await service.findAll(10, 0);
    expect(result).toEqual({
      data: {
        content: [
          {
            nome: 'Safra 2022'
          }
        ],
        total: 1,
        totalPages: Infinity,
      },
      error: null,
      message: "Ação realizada com sucesso."
    });
  });

  // it('deve retornar uma safra por ID', async () => {
  //   const result = await service.findOne(idPublic);
  //   expect(result).toEqual(mockSafra);
  //   expect(repo.findOneBy).toHaveBeenCalledWith({ idPublic: idPublic });
  // });
});