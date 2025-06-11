import { Propriedade } from "src/propriedades/entities/propriedade.entity";
import { Safra } from "src/safras/entities/safra.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('culturas')
export class Cultura {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    nome: string;

    @ManyToOne(() => Safra, safra => safra.culturas)
    @JoinColumn({ name: 'safra_id' })
    safra: Safra;

    @ManyToOne(() => Propriedade, propriedade => propriedade.culturas)
    @JoinColumn({ name: 'propriedade_id' })
    propriedade: Propriedade;
}
