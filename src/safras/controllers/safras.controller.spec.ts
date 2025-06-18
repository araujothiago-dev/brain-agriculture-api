import { Test, TestingModule } from '@nestjs/testing';
import { SafrasService } from '../services/safras.service';
import { SafrasController } from './safras.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Safra } from '../entities/safra.entity';
import { DataSource } from 'typeorm';

describe('SafrasController', () => {
  let controller: SafrasController;
  let service: SafrasService;

  const mockRepository = {
    find: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SafrasController],
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

    controller = module.get<SafrasController>(SafrasController);
    service = module.get<SafrasService>(SafrasService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
