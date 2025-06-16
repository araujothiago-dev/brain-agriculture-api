import { Test, TestingModule } from '@nestjs/testing';
import { CulturasService } from '../services/culturas.service';
import { CulturasController } from './culturas.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cultura } from '../entities/cultura.entity';
import { DataSource } from 'typeorm';

describe('CulturasController', () => {
  let controller: CulturasController;
  let service: CulturasService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CulturasController],
      providers: [
        CulturasService,
        {
          provide: getRepositoryToken(Cultura),
          useValue: mockRepository
        },
        {
          provide: DataSource,
          useValue: {
            getRepository: jest.fn().mockReturnValue(mockRepository),
          }
        }
      ],
    }).compile();

    controller = module.get<CulturasController>(CulturasController);
    service = module.get<CulturasService>(CulturasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
