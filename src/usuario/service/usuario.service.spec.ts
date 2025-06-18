import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CpfCnpjVerify } from 'src/utils/cpf-cnpj-verify/cpf-cnpj-verify';
import { PassVerify } from 'src/utils/pass-verify/passVerify';
import { DataSource, Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { UsuarioService } from './usuario.service';

describe('UsuarioService', () => {
    let service: UsuarioService;
    let repo: Repository<Usuario>;
    let cpfCnpjVerify: CpfCnpjVerify;
    let passVerify: PassVerify;

    const mockUsuario = {
        idPublic: '1-uuid-teste',
        nome: 'João Silva Araujo',
        email: 'joaoaraujo@email.com',
        cpfCnpj: '89.209.082/0001-92',
        senha: '123456*An',
        perfil: 2
    };

    const invalidUsuario = {
        ...mockUsuario,
        cpfCnpj: '12345678900',
        nome: 'João Silva Araujo',
        email: 'joaoaraujo2@email.com',
        senha: '123456',
        perfil: 2
    };

    const mockPerfilRepository = {
        findOneBy: jest.fn().mockResolvedValue({ id: 1 }),
        findOne: jest.fn().mockResolvedValue({ id: 1 })
    };

    const mockRepository = {
        find: jest.fn().mockResolvedValue(null),
        findOne: jest.fn().mockResolvedValue(null),
        findOneBy: jest.fn().mockResolvedValue({ id: 1, ...mockUsuario }),
        save: jest.fn().mockResolvedValue({ id: 1, ...mockUsuario }),
        create: jest.fn().mockResolvedValue({ id: 1, ...mockUsuario }),
        findAndCount: jest.fn().mockResolvedValue([[mockUsuario], 1])
    };

    const mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
            save: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
        },
    };

    const mockDataSource = {
        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
        getRepository: jest.fn((entity) => {
            if (entity.name === 'Perfil') return mockPerfilRepository;
            if (entity.name === 'Usuario') return mockRepository;
            return mockRepository;
        }),
        manager: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
        }
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
        cpfCnpjVerify = module.get<CpfCnpjVerify>(CpfCnpjVerify);
        passVerify = module.get<PassVerify>(PassVerify);
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
                        idPublic: "1-uuid-teste",
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

    it('deve lançar erro ao criar usuário com áreas inválidas', async () => {
        const cpfCnpjVerifyMock = jest.spyOn(
            (service as any).cpfCnpjVerify,
            'cpfCnpjVerify'
        ).mockReturnValue(false);

        await expect(service.create(invalidUsuario as any)).rejects.toThrow('Não foi possível cadastrar Usuário. ');

        cpfCnpjVerifyMock.mockRestore();
    });

    it('deve lançar erro ao criar usuário com email já existente', async () => {
        mockRepository.findOne = jest.fn().mockResolvedValue({ ...mockUsuario });
        await expect(service.create({ ...mockUsuario, cpfCnpj: "89.209.082/0001-91" } as any)).rejects.toThrow('Não foi possível cadastrar Usuário. ');
    });

    it('deve lançar erro ao criar usuário com senha inválida', async () => {
        (passVerify.passVerify as jest.Mock).mockResolvedValueOnce(false);
        await expect(service.create(invalidUsuario as any)).rejects.toThrow('Não foi possível cadastrar Usuário. ');
        expect(passVerify.passVerify).toHaveBeenCalledWith('123456');
    });

    it('deve lançar erro ao criar usuário com CPF inválido', async () => {
        (cpfCnpjVerify.cpfCnpjVerify as jest.Mock).mockResolvedValueOnce(false);
        await expect(service.create(invalidUsuario as any)).rejects.toThrow('Não foi possível cadastrar Usuário. ');
        expect(cpfCnpjVerify.cpfCnpjVerify).toHaveBeenCalledWith('12345678900');
    });

    it('deve lançar erro ao criar usuário com cpf já existente', async () => {
        mockRepository.findOne = jest.fn().mockResolvedValue({ ...mockUsuario });
        await expect(service.create({ ...mockUsuario, email: 'joaoaraujo@email.com' } as any)).rejects.toThrow('Não foi possível cadastrar Usuário. ');
    });

    it('deve lançar erro ao criar usuario com perfil inexistente', async () => {
        mockRepository.findOne = jest.fn().mockResolvedValue(null);
        mockPerfilRepository.findOneBy = jest.fn().mockResolvedValue(null);
        await expect(service.create({ ...mockUsuario, perfil: { id: 99999 } } as any)).rejects.toThrow('Não foi possível cadastrar Usuário. ');
    });

});
