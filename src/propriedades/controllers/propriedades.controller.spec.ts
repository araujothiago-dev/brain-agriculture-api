import { Test, TestingModule } from '@nestjs/testing';
import { PropriedadesService } from '../services/propriedades.service';
import { PropriedadesController } from './propriedades.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Propriedade } from '../entities/propriedade.entity';
import { DataSource } from 'typeorm';

describe('PropriedadesController', () => {
  let controller: PropriedadesController;
  let service: PropriedadesService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropriedadesController],
      providers: [
        PropriedadesService,
        {
          provide: getRepositoryToken(Propriedade),
          useValue: mockRepository
        },
        {
          provide: DataSource,
          useValue: {
            getRepository: jest.fn().mockReturnValue(mockRepository),
          },
        }
        ],
    }).compile();

    controller = module.get<PropriedadesController>(PropriedadesController);
    service = module.get<PropriedadesService>(PropriedadesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
