import { Test } from "@nestjs/testing";
import { CulturasService } from "./culturas.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Cultura } from "../entities/cultura.entity";
import { DataSource, Repository } from "typeorm";


describe('CulturaService', () => {
  let service: CulturasService;
  let repo: Repository<Cultura>;

  const mockCultura = {
    nome: 'Soja',
  };

  const mockRepository = {
    find: jest.fn().mockResolvedValue(null),
    findOne: jest.fn().mockResolvedValue(null),
    findOneBy: jest.fn().mockResolvedValue({ id: 1, ...mockCultura }),
    save: jest.fn().mockResolvedValue({ id: 1, ...mockCultura }),
    create: jest.fn().mockResolvedValue({ id: 1, ...mockCultura }),
    findAndCount: jest.fn().mockResolvedValue([[mockCultura], 1])
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CulturasService,
        {
          provide: getRepositoryToken(Cultura),
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

    service = module.get<CulturasService>(CulturasService);
    repo = module.get<Repository<Cultura>>(getRepositoryToken(Cultura));
  });

  it('deve criar uma nova cultura', async () => {
    const result = await service.create(mockCultura as any);
    expect(result).toEqual({
      data: {
        ...mockCultura,
        id: 1
      },
      error: null,
      message: "Ação realizada com sucesso."
    });
    expect(repo.save).toHaveBeenCalled();
  });

  it('deve retornar todas as culturas', async () => {
    mockRepository.find.mockResolvedValue([mockCultura]);
    const result = await service.findAll(10, 0);
    expect(result).toEqual({
      data: {
        content: [
          {
            nome: 'Soja',
          }
        ],
        total: 1,
        totalPages: Infinity,
      },
      error: null,
      message: "Ação realizada com sucesso."
    });
  });

  // it('deve retornar uma cultura por ID', async () => {
  //   mockRepository.findOneBy.mockResolvedValue(mockCultura);
  //   const result = await service.findOne('1');
  //   expect(result).toEqual(mockCultura);
  // });
});
