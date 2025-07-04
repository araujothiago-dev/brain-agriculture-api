import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoresService } from '../services/produtores.service';
import { ProdutoresController } from './produtores.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Produtor } from '../entities/produtor.entity';
import { DataSource } from 'typeorm';
import { CpfCnpjVerify } from 'src/utils/cpf-cnpj-verify/cpf-cnpj-verify';
import { UsuarioService } from 'src/usuario/service/usuario.service';

describe('ProdutoresController', () => {
  let controller: ProdutoresController;
  let service: ProdutoresService;

  const mockUsuarioService = {
    find: jest.fn(),
    save: jest.fn(),
  };

  const mockRepository = {
    find: jest.fn(),
    save: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoresController],
      providers: [
        ProdutoresService,
        {
          provide: getRepositoryToken(Produtor),
          useValue: mockRepository
        },
        {
          provide: DataSource,
          useValue: {
            getRepository: jest.fn().mockReturnValue(mockRepository),
          },
        },
        {
          provide: UsuarioService,
          useValue: {
            verify: jest.fn().mockReturnValue(mockUsuarioService),
          },
        },
        {
          provide: CpfCnpjVerify,
          useValue: {
            verify: jest.fn().mockReturnValue(mockRepository),
          },
        }
      ],
    }).compile();

    controller = module.get<ProdutoresController>(ProdutoresController);
    service = module.get<ProdutoresService>(ProdutoresService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
