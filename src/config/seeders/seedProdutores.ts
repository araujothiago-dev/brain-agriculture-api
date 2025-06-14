import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { CreateProdutoreDto } from 'src/produtores/dto/create-produtor.dto';
import { Produtor } from 'src/produtores/entities/produtor.entity';
import { ProdutoresService } from 'src/produtores/services/produtores.service';
import { DataSource } from 'typeorm';

export async function seedProdutores(dataSource: DataSource) {
    const logger = new Logger('SeeddProdutores');
    const app = await NestFactory.createApplicationContext(AppModule);
    const produtorService = app.get(ProdutoresService);

    const produtores = [
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

    for (const produtorData of produtores) {
        logger.log(`Inserindo produtor ${produtorData.nome}...`);

        const existente = await produtorRepository.findOne({ where: { cpfCnpj: produtorData.cpfCnpj } });
        if (!existente) {
            try {
                logger.log(`Produtor ${produtorData.nome} criado com sucesso.`);

                await produtorService.create(produtorData as CreateProdutoreDto);
            } catch (error) {
                logger.error(`Erro ao inserir produtor ${produtorData.nome}`, error?.response?.erro || error.message);
            }
        } else {
            logger.log(`Produtor ${produtorData.nome} já existe, pulando inserção.`);
        }
    }
    logger.log('Seed de produtores concluído.');
    await app.close();
}
