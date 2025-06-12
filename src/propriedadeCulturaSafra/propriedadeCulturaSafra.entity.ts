import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, DeleteDateColumn } from "typeorm";
import { Cultura } from "src/culturas/entities/cultura.entity";
import { Safra } from "src/safras/entities/safra.entity";
import { Propriedade } from "src/propriedades/entities/propriedade.entity";

@Entity({ name: 'propriedade_cultura_safra', schema: 'public' })
export class PropriedadeCulturaSafra {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Propriedade, { eager: true })
    @JoinColumn({ name: 'propriedade_id' })
    propriedade: Propriedade;

    @ManyToOne(() => Cultura, { eager: true })
    @JoinColumn({ name: 'cultura_id' })
    cultura: Cultura;

    @ManyToOne(() => Safra, { eager: true })
    @JoinColumn({ name: 'safra_id' })
    safra: Safra;

    @DeleteDateColumn()
    dataDelete: Date;
}