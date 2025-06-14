import { Cultura } from 'src/culturas/entities/cultura.entity';
import { DataSource } from 'typeorm';

export async function seedCultura(dataSource: DataSource) {
    const culturas = [
        { nome: 'Soja', ativo: true },
        { nome: 'Milho', ativo: true },
        { nome: 'Algodão', ativo: true },
        { nome: 'Arroz', ativo: true },
        { nome: 'Feijão', ativo: true },
        { nome: 'Cana-de-açúcar', ativo: true },
    ];

    for (const culturaData of culturas) {
        const exists = await dataSource.getRepository(Cultura).findOne({ where: { nome: culturaData.nome } });
        if (!exists) {
            await dataSource.getRepository(Cultura).save(culturaData);
        }
    }
}
