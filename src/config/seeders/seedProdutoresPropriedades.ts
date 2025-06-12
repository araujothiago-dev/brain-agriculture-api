import { Produtor } from 'src/produtores/entities/produtor.entity';
import { Propriedade } from 'src/propriedades/entities/propriedade.entity';
import { DataSource } from 'typeorm';

export async function seedProdutoresPropriedades(dataSource: DataSource) {
    const propriedadeProdutoData = [
        {
            nome: 'João Silva',
            cpfCnpj: '12345678900',
            propriedade: [
                {
                    nome: 'Fazenda Boa Vista',
                    cidade: {
                        id: 1
                    },
                    area_total: 1000,
                    area_agricultavel: 800,
                    area_vegetacao: 200,
                    ativo: true,
                    cultura: [
                        { id: 2, safra: { id: 1 } },
                        { id: 1, safra: { id: 1 } },
                    ],
                },
                {
                    nome: 'Fazenda Santa Maria',
                    cidade: {
                        id: 3
                    },
                    area_total: 1500,
                    area_agricultavel: 1200,
                    area_vegetacao: 300,
                    ativo: true,
                    cultura: [
                        { id: 2, safra: { id: 2 } },
                        { id: 3, safra: { id: 2 } },
                    ],
                },
                {
                    nome: 'Fazenda Nova Esperança',
                    cidade: {
                        id: 2
                    },
                    area_total: 2000,
                    area_agricultavel: 1600,
                    area_vegetacao: 400,
                    ativo: true,
                    cultura: [
                        { id: 3, safra: { id: 3 } },
                        { id: 1, safra: { id: 3 } },
                    ],
                },
            ]
        },
        {
            nome: 'Maria Souza',
            cpfCnpj: '98765432100',
            propriedade: {
                nome: 'Fazenda Santa Maria',
                cidade: {
                        id: 1
                    },
                area_total: 1500,
                area_agricultavel: 1200,
                area_vegetacao: 300,
                cultura: [
                    { id: 4, safra: { id: 4 } },
                    { id: 2, safra: { id: 4 } },
                ],
            },
        },
        {
            nome: 'Carlos Pereira',
            cpfCnpj: '22233344455',
            propriedade: {
                nome: 'Fazenda Nova Esperança',
                cidade: {
                        id: 2
                    },
                area_total: 2000,
                area_agricultavel: 1600,
                area_vegetacao: 400,
                cultura: [
                    { id: 2, safra: { id: 2 } },
                    { id: 4, safra: { id: 2 } },
                ],
            },
        },
    ];

    // // Supondo que já exista uma safra padrão
    // const safra = await dataSource.getRepository(Safra).findOne({ where: { nome: 'Safra 2021' } })
    //     || await dataSource.getRepository(Safra).save({ nome: 'Safra 2021', ativo: true });

    // // Busca todas as safras cadastradas
    // const todasSafras = await dataSource.getRepository(Safra).find();

    for (const data of propriedadeProdutoData) {
        // Cria produtor
        const produtor = await dataSource.getRepository(Produtor).save({
            nome: data.nome,
            cpfCnpj: data.cpfCnpj,
            ativo: true,
        });

        // Normaliza propriedades para array
        const propriedades = Array.isArray(data.propriedade) ? data.propriedade : [data.propriedade];

        for (const prop of propriedades) {
            // Normaliza nomes dos campos
            const nome = prop.nome;
            const cidade = prop.cidade;
            const area_total = prop.area_total;
            const area_agricultavel = prop.area_agricultavel;
            const area_vegetacao = prop.area_vegetacao;
            const culturas = prop.cultura;

            // Cria propriedade
            const propriedade: Propriedade = await dataSource.getRepository(Propriedade).save({
                nome,
                cidade,
                area_total,
                area_agricultavel,
                area_vegetacao,
                produtor: produtor,
                culturas: culturas,
                ativo: true,
            });

            if (propriedade) {
                // Relaciona a propriedade com o produtor
                propriedade.produtor = produtor;
                await dataSource.getRepository(Propriedade).save(propriedade);
            }

            // // Relaciona culturas à propriedade e a uma safra aleatória
            // for (const crop of culturas) {
            //     // Busca ou cria cultura
            //     let cultura = await dataSource.getRepository(Cultura).findOne({ where: { id: crop.id } });
            //     if (!cultura) {
            //         cultura = await dataSource.getRepository(Cultura).save({ id: crop.id, ativo: true });
            //     }

            //     // Escolhe uma safra aleatória
            //     const safraAleatoria = todasSafras[Math.floor(Math.random() * todasSafras.length)];

            //     // Cria relação propriedade-cultura-safra
            //     await dataSource.getRepository(PropriedadeCulturaSafra).save({
            //         propriedade,
            //         cultura,
            //         safra: safraAleatoria,
            //     }); 
            // }
        }
    }
}
