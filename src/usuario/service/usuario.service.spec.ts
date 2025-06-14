import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repo: Repository<Usuario>;

  const mockUsuario = {
    id: 1,
    idPublic: 'uuid',
    nome: 'João',
    email: 'joao@email.com',
    cpfCnpj: '12345678900',
    senha: 'hashed',
    ativo: true,
    perfil: {
      id: 1,
      nome: '',
      ativo: false,
      permission: [],
      usuario: [],
      createdBy: '',
      updatedBy: '',
      idPublic: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    lastAccess: new Date(),
    firstAccess: new Date(),
    createdBy: 'system',
    updatedBy: ''
  };

  const mockRepository = {
    find: jest.fn().mockResolvedValue([mockUsuario]),
    findOne: jest.fn().mockResolvedValue(mockUsuario),
    save: jest.fn().mockResolvedValue(mockUsuario),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repo = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  it('deve retornar todos os usuários', async () => {
    const result = await service.findAllAdmin('testParameter', 0, 10);
    expect(result).toEqual([mockUsuario]);
    expect(repo.find).toHaveBeenCalled();
  });

  it('deve retornar um usuário por ID', async () => {
    const result = await service.findOne('1');
    expect(result).toEqual(mockUsuario);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('deve criar um novo usuário', async () => {
    const result = await service.create({
      nome: 'João',
      email: 'joao@email.com',
      cpfCnpj: '12345678900',
      senha: 'senha123',
      perfil: null,
    } as any);
    expect(result).toEqual(mockUsuario);
    expect(repo.save).toHaveBeenCalled();
  });
});
