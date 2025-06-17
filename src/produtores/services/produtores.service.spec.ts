import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsuarioService } from 'src/usuario/service/usuario.service';
import { CpfCnpjVerify } from 'src/utils/cpf-cnpj-verify/cpf-cnpj-verify';
import { DataSource, Repository } from 'typeorm';
import { Produtor } from '../entities/produtor.entity';
import { ProdutoresService } from './produtores.service';

describe('ProdutorService', () => {
    let service: ProdutoresService;
    let repo: Repository<Produtor>;

    const mockUsuarioProdutor = {
        nome: 'João Silva Araujo',
        email: 'joaoaraujo@email.com',
        cpfCnpj: '89.209.082/0001-92',
        senha: '123456*An',
        perfil: {
            id: 2
        }
    };

    const mockProdutor = {
        nome: 'João Silva Araujo',
        cpfCnpj: '89.209.082/0001-92',
        usuario: mockUsuarioProdutor
    };

    const mockPerfilRepository = {
        findOneBy: jest.fn().mockResolvedValue({ id: 2, nome: 'CLIENTE' }),
    };

    const mockRepository = {
        find: jest.fn().mockResolvedValue(null),
        findOne: jest.fn().mockResolvedValue(null),
        save: jest.fn().mockResolvedValue({ id: 1, ...mockProdutor }),
        findOneBy: jest.fn().mockResolvedValue({ id: 1, ...mockProdutor }),
        create: jest.fn().mockResolvedValue({ id: 1, ...mockProdutor }),
        findAndCount: jest.fn().mockResolvedValue([[mockProdutor], 1])
    };

    const mockUsuarioService = {
        find: jest.fn().mockResolvedValue([mockUsuarioProdutor]),
        save: jest.fn().mockResolvedValue(mockUsuarioProdutor),
        create: jest.fn().mockResolvedValue({
            data: mockUsuarioProdutor,
            error: null,
            message: "Ação realizada com sucesso."
        }),
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
                ProdutoresService,
                {
                    provide: getRepositoryToken(Produtor),
                    useValue: mockRepository,
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource
                },
                {
                    provide: UsuarioService,
                    useValue: mockUsuarioService,
                },
                {
                    provide: CpfCnpjVerify,
                    useValue: {
                        cpfCnpjVerify: jest.fn().mockReturnValue(true),
                    },
                }
            ],
        }).compile();

        service = module.get<ProdutoresService>(ProdutoresService);
        repo = module.get<Repository<Produtor>>(getRepositoryToken(Produtor));
    });

    it('deve criar um novo produtor', async () => {
        mockRepository.findOne = jest.fn().mockResolvedValue(null);
        const result = await service.create(mockProdutor as any);
        expect(result).toEqual({
            data: {
                ...mockProdutor,
                id: 1,
            },
            error: null,
            message: "Ação realizada com sucesso."
        });
        expect(repo.save).toHaveBeenCalled();
    });

    it('deve retornar todos os produtores', async () => {
        mockRepository.find.mockResolvedValue(null);
        const result = await service.findAll(10, 0);
        expect(result).toEqual({
            data: {
                content: [
                    {
                        nome: 'João Silva Araujo',
                        cpfCnpj: '89.209.082/0001-92',
                        usuario: {
                            nome: 'João Silva Araujo',
                            email: 'joaoaraujo@email.com',
                            cpfCnpj: '89.209.082/0001-92',
                            senha: expect.any(String),
                            perfil: {
                                id: 2,
                                nome: 'CLIENTE'
                            }
                        }
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