import { Safra } from 'src/safras/entities/safra.entity';
import { DataSource } from 'typeorm';

export async function seedSafra(dataSource: DataSource) {
    const safras = [
        { nome: 'Safra 2022', ativo: true },
        { nome: 'Safra 2023', ativo: true },
        { nome: 'Safra 2024', ativo: true },
        { nome: 'Safra 2025', ativo: true },
    ];

    for (const safraData of safras) {
        const exists = await dataSource.getRepository(Safra).findOne({ where: { nome: safraData.nome } });
        if (!exists) {
            await dataSource.getRepository(Safra).save(safraData);
        }
    }
}
