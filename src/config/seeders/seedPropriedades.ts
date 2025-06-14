import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { Cultura } from 'src/culturas/entities/cultura.entity';
import { PropriedadeCulturaSafra } from 'src/propriedadeCulturaSafra/propriedadeCulturaSafra.entity';
import { CreatePropriedadeDto } from 'src/propriedades/dto/create-propriedade.dto';
import { Propriedade } from 'src/propriedades/entities/propriedade.entity';
import { PropriedadesService } from 'src/propriedades/services/propriedades.service';
import { Safra } from 'src/safras/entities/safra.entity';
import { DataSource } from 'typeorm';

export async function seedPropriedades(dataSource: DataSource) {
    const app = await NestFactory.createApplicationContext(AppModule);
    const propriedadesService = app.get(PropriedadesService);

    await dataSource.query(`
        TRUNCATE TABLE 
        "propriedade_cultura_safra", 
        "safras", 
        "culturas", 
        "propriedades" 
        CASCADE;
    `);

    const propriedadeData = [
        {
            nome: 'Fazenda Boa Vista',
            matricula: 1,
            produtor: {
                id: 35
            },
            cidade: {
                id: 303187
            },
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
                id: 35
            },
            cidade: {
                id: 303187
            },
            areaTotal: 1500,
            areaAgricultavel: 1200,
            areaVegetacao: 300,
            ativo: true,
            culturas: [
                { culturaId: { id: 2 }, safraId: { id: 2 } },
                { culturaId: { id: 3 }, safraId: { id: 2 } },
            ],
        },
        {
            nome: 'Fazenda Nova Esperança',
            matricula: 3,
            produtor: {
                id: 35
            },
            cidade: {
                id: 303187
            },
            areaTotal: 2000,
            areaAgricultavel: 1600,
            areaVegetacao: 400,
            ativo: true,
            culturas: [
                { culturaId: { id: 3 }, safraId: { id: 3 } },
                { culturaId: { id: 1 }, safraId: { id: 3 } },
            ],
        },
        {
            nome: 'Fazenda Santa Maria',
            matricula: 4,
            produtor: {
                id: 36
            },
            cidade: {
                id: 303187
            },
            areaTotal: 1500,
            areaAgricultavel: 1200,
            areaVegetacao: 300,
            culturas: [
                { culturaId: { id: 4 }, safraId: { id: 4 } },
                { culturaId: { id: 2 }, safraId: { id: 4 } },
            ],
        },
        {
            nome: 'Fazenda Nova Esperança',
            matricula: 5,
            produtor: {
                id: 37
            },
            cidade: {
                id: 303187
            },
            areaTotal: 2000,
            areaAgricultavel: 1600,
            areaVegetacao: 400,
            culturas: [
                { culturaId: { id: 2 }, safraId: { id: 2 } },
                { culturaId: { id: 4 }, safraId: { id: 2 } },
            ],
        },
    ];

    for (const prop of propriedadeData) {
        const nome = prop.nome;
        const matricula = prop.matricula;
        const produtor = prop.produtor;
        const cidade = prop.cidade;
        const areaTotal = prop.areaTotal;
        const areaAgricultavel = prop.areaAgricultavel;
        const areaVegetacao = prop.areaVegetacao;
        const cultura = prop.culturas;

        const propriedade: Propriedade = await dataSource.getRepository(Propriedade).save({
            nome,
            matricula,
            cidade,
            areaTotal,
            areaAgricultavel,
            areaVegetacao,
            produtor,
            cultura: cultura,
            ativo: true,
        });

        const propriedadeRepository = dataSource.getRepository(Propriedade);

        // You must provide the idPublic string here; if you don't have it, you need to query by matricula using the repository directly or implement a new service method.
        // Example using repository directly:
        const existente = await dataSource.getRepository(Propriedade).findOne({ where: { matricula: Number(propriedade.matricula) } });
        if (!existente) {
            try {
                await propriedadesService.create(prop as CreatePropriedadeDto);
            } catch (error) {
                console.error(`Erro ao inserir propriedade matrícula ${prop.matricula}:`, error.response?.erro || error.message);
            }
        } else {
            console.log(`Propriedade matrícula ${prop.matricula} já existe, pulando inserção.`);
        }
    }

}
