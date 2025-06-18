import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { Safra } from 'src/safras/entities/safra.entity';
import { DataSource } from 'typeorm';
import { SafrasService } from '../../safras/services/safras.service';

export async function seedSafra(dataSource: DataSource) {
    const logger = new Logger('SeedSafras');
    const app = await NestFactory.createApplicationContext(AppModule);
    try {
        const safrasService = app.get(SafrasService);

        logger.log('Iniciando limpeza das tabelas...');
        try {
            await dataSource.query(`
            TRUNCATE TABLE 
            "produtores",
            "propriedade_cultura_safra", 
            "safras", 
            "culturas", 
            "propriedades"
            RESTART IDENTITY CASCADE;

            TRUNCATE TABLE 
            "produtores"
            RESTART IDENTITY CASCADE;
            
            DELETE FROM "security"."usuario"
            WHERE email != 'admin@brain.agriculture.com';

            SELECT setval('security.usuario_id_seq', (SELECT MAX(id) FROM security.usuario));

        `);
            logger.log('Tabelas truncadas com sucesso.');
        } catch (error) {
            logger.error('Erro ao truncar tabelas:', error);
            // return;
            await app.close();
        }

        const safras = [
            { nome: 'Safra 2022', ativo: true },
            { nome: 'Safra 2023', ativo: true },
            { nome: 'Safra 2024', ativo: true },
            { nome: 'Safra 2025', ativo: true },
        ];

        for (const safraData of safras) {
            logger.log(`Inserindo safra ${safraData.nome}...`);

            const existente = await dataSource.getRepository(Safra).findOne({ where: { nome: safraData.nome } });
            if (!existente) {
                try {
                    await safrasService.create(safraData);
                    logger.log(`Safra ${safraData.nome} criada com sucesso.`);
                } catch (error) {
                    logger.error(`Erro ao inserir safra ${safraData.nome}`, error?.response?.erro || error.message);
                }
            } else {
                logger.log(`Safra ${safraData.nome} já existe, pulando inserção.`);
            }
        }
        logger.log('Seed de safras concluído.');
    } catch (error) {
        logger.error('Erro durante o seed de safras', error.message);
        throw error;
    } finally {
        await app.close();
    }
}
