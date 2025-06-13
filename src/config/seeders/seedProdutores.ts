import { Produtor } from 'src/produtores/entities/produtor.entity';
import { DataSource } from 'typeorm';

export async function seedProdutores(dataSource: DataSource) {
    const produtorData = [
        {
            nome: 'João Silva LTDA',
            cpfCnpj: '41.058.864/0001-41',
            usuario: {
                email: 'joaosilva@gmail.com',
                senha: 'An123456*',
                ativo: true,
                perfil: {
                    id: 2
                }
            }
        },
        {
            nome: 'Maria Souza',
            cpfCnpj: '98765432100',
            usuario: { 
                email: 'mariasouza2@gmail.com',
                senha: 'An123456*',
                ativo: true,
                perfil: {
                    id: 2
                }
            },
        },
        {
            nome: 'Carlos Pereira',
            cpfCnpj: '22233344455',
            usuario: {
                email: 'carlospereira@gmail.com',
                senha: 'An123456*',
                ativo: true,
                perfil: {
                    id: 2
                }
            },
        },
    ];


    const produtorRepository = dataSource.getRepository(Produtor);

    for (const data of produtorData) {
        const existente = await produtorRepository.findOne({ where: { cpfCnpj: data.cpfCnpj } });
        if (!existente) {
            await produtorRepository.save(data);
        }
    }
}
