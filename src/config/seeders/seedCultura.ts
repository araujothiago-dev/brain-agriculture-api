import { INestApplicationContext, Logger } from '@nestjs/common';
import { CreateCulturaDto } from 'src/culturas/dto/create-cultura.dto';
import { Cultura } from 'src/culturas/entities/cultura.entity';
import { CulturasService } from 'src/culturas/services/culturas.service';
import { DataSource } from 'typeorm';

export async function seedCultura(dataSource: DataSource, app: INestApplicationContext) {
    const logger = new Logger('SeedCulturas');

    try {
        const culturasServices = app.get(CulturasService);

        const culturas = [
            { nome: 'Soja', ativo: true },
            { nome: 'Milho', ativo: true },
            { nome: 'Algodão', ativo: true },
            { nome: 'Arroz', ativo: true },
            { nome: 'Feijão', ativo: true },
            { nome: 'Cana-de-açúcar', ativo: true },
        ];

        for (const culturaData of culturas) {
            const logger = new Logger('SeedCulturas');
            logger.log(`Inserindo cultura ${culturaData.nome}...`);

            const existente = await dataSource.getRepository(Cultura).findOne({ where: { nome: culturaData.nome } });
            if (!existente) {
                try {
                    await culturasServices.create(culturaData as CreateCulturaDto);
                    logger.log(`Cultura ${culturaData.nome} criada com sucesso.`);
                } catch (error) {
                    logger.error(`Erro ao inserir cultura ${culturaData.nome}`, error?.response?.erro || error.message);
                }
            } else {
                logger.log(`Cultura ${culturaData.nome} já existe, pulando inserção.`);
            }
        }
        logger.log('Seed de culturas concluído.');
    } catch (error) {
        logger.error('Erro durante o seed de culturas', error.message);
        throw error;
    } 
}
