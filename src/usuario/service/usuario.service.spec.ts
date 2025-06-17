import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { CpfCnpjVerify } from 'src/utils/cpf-cnpj-verify/cpf-cnpj-verify';
import { PassVerify } from 'src/utils/pass-verify/passVerify';

describe('UsuarioService', () => {
    let service: UsuarioService;
    let repo: Repository<Usuario>;

    const mockUsuario = {
        nome: 'João Silva Araujo',
        email: 'joaoaraujo@email.com',
        cpfCnpj: '89.209.082/0001-92',
        senha: '123456*An',
        perfil: 2
    };

    const mockPerfilRepository = {
        findOneBy: jest.fn().mockResolvedValue({ id: 2, nome: 'CLIENTE' }),
    };

    const mockRepository = {
        find: jest.fn().mockResolvedValue(null),
        findOne: jest.fn().mockResolvedValue(null),
        findOneBy: jest.fn().mockResolvedValue({ id: 1, ...mockUsuario }),
        save: jest.fn().mockResolvedValue({ id: 1, ...mockUsuario }),
        create: jest.fn().mockResolvedValue({ id: 1, ...mockUsuario }),
        findAndCount: jest.fn().mockResolvedValue([[mockUsuario], 1])
    };

    const mockDataSource = {
        getRepository: jest.fn((entity) => {
            if (entity.name === 'Perfil') return mockPerfilRepository;
            if (entity.name === 'Usuario') return mockRepository;
            return mockRepository;
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsuarioService,
                {
                    provide: getRepositoryToken(Usuario),
                    useValue: mockRepository,
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
                {
                    provide: PassVerify,
                    useValue: {
                        passVerify: jest.fn().mockReturnValue(true),
                    },
                },
                {
                    provide: CpfCnpjVerify,
                    useValue: {
                        cpfCnpjVerify: jest.fn().mockReturnValue(true),
                    },
                }
            ],
        }).compile();

        service = module.get<UsuarioService>(UsuarioService);
        repo = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
    });

    it('deve criar um novo usuário', async () => {
        mockRepository.findOne = jest.fn().mockResolvedValue(null);
        const result = await service.create(mockUsuario as any);
        expect(result).toEqual({
            data: {
                ...mockUsuario,
                cpfCnpj: "89.209.082/0001-92",
                senha: expect.any(String),
                id: 1
            },
            error: null,
            message: "Ação realizada com sucesso."
        });
        expect(repo.save).toHaveBeenCalled();
    });

    it('deve retornar todos os usuários', async () => {
        mockRepository.find.mockResolvedValue(null);
        const result = await service.findAllAdmin('', 10, 0);
        expect(result).toEqual({
            data: {
                content: [
                    {
                        cpfCnpj: "89.209.082/0001-92",
                        email: "joaoaraujo@email.com",
                        nome: "João Silva Araujo",
                        perfil: 2,
                        senha: expect.any(String),
                    }
                ],
                total: 1,
                totalPages: Infinity,
            },
            error: null,
            message: "Ação realizada com sucesso."
        });
        expect(repo.findAndCount).toHaveBeenCalled();
    });
});
