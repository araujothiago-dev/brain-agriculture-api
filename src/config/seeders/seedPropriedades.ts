import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { CreatePropriedadeDto } from 'src/propriedades/dto/create-propriedade.dto';
import { PropriedadesService } from 'src/propriedades/services/propriedades.service';
import { Propriedade } from 'src/propriedades/entities/propriedade.entity';
import { DataSource } from 'typeorm';

export async function seedPropriedades(dataSource: DataSource) {
    const logger = new Logger('SeedPropriedades');
    const app = await NestFactory.createApplicationContext(AppModule);

    try {
        const propriedadesService = app.get(PropriedadesService);

        const propriedadeData = [
            {
                nome: 'Fazenda Boa Vista',
                matricula: 1,
                produtor: { id: 1 },
                cidade: { id: 1 },
                areaTotal: 1000,
                areaAgricultavel: 800,
                areaVegetacao: 200,
                ativo: true,
                culturas: [
                    { culturaId: { id: 4 }, safrasId: { id: 2 } },
                    { culturaId: { id: 2 }, safrasId: { id: 2 } }
                ]
            },
            {
                nome: 'Fazenda Santa Maria',
                matricula: 2,
                produtor: {
                    id: 1
                },
                cidade: {
                    id: 1
                },
                areaTotal: 1500,
                areaAgricultavel: 1200,
                areaVegetacao: 300,
                ativo: true,
                culturas: [
                    { culturaId: { id: 2 }, safrasId: { id: 2 } },
                    { culturaId: { id: 3 }, safrasId: { id: 2 } },
                ],
            },
            {
                nome: 'Fazenda Nova Esperança',
                matricula: 3,
                produtor: {
                    id: 1
                },
                cidade: {
                    id: 1
                },
                areaTotal: 2000,
                areaAgricultavel: 1600,
                areaVegetacao: 400,
                ativo: true,
                culturas: [
                    { culturaId: { id: 3 }, safrasId: { id: 3 } },
                    { culturaId: { id: 1 }, safrasId: { id: 3 } },
                ],
            },
            {
                nome: 'Fazenda Santa Maria',
                matricula: 4,
                produtor: {
                    id: 2
                },
                cidade: {
                    id: 1
                },
                areaTotal: 1500,
                areaAgricultavel: 1200,
                areaVegetacao: 300,
                culturas: [
                    { culturaId: { id: 4 }, safrasId: { id: 4 } },
                    { culturaId: { id: 2 }, safrasId: { id: 4 } },
                ],
            },
            {
                nome: 'Fazenda Nova Esperança',
                matricula: 5,
                produtor: {
                    id: 3
                },
                cidade: {
                    id: 1
                },
                areaTotal: 2000,
                areaAgricultavel: 1600,
                areaVegetacao: 400,
                culturas: [
                    { culturaId: { id: 2 }, safrasId: { id: 2 } },
                    { culturaId: { id: 4 }, safrasId: { id: 2 } },
                ],
            },
        ];

        for (const propData of propriedadeData) {
            logger.log(`Inserindo propriedade matrícula ${propData.matricula} - ${propData.nome}...`);

            const existente = await dataSource.getRepository(Propriedade).findOne({ where: { matricula: Number(propData.matricula) } });
            if (!existente) {
                try {
                    await propriedadesService.create(propData as CreatePropriedadeDto);
                    logger.log(`Propriedade ${propData.nome} (matrícula ${propData.matricula}) criada com sucesso.`);

                } catch (error) {
                    logger.error(`Erro ao inserir propriedade ${propData.nome} (matrícula ${propData.matricula})`, error?.response?.erro || error.message);
                }
            } else {
                logger.log(`Propriedade matrícula ${propData.matricula} já existe, pulando inserção.`);
            }
        }

        logger.log('Seed de propriedades concluído.');
    } catch (error) {
        logger.error('Erro durante o seed de propriedades', error.message);
        throw error;
    } finally {
        await app.close();
    }
}
