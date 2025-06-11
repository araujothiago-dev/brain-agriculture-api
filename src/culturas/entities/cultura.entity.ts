import { Propriedade } from "src/propriedades/entities/propriedade.entity";
import { Safra } from "src/safras/entities/safra.entity";
import { Column, Entity, Generated, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'culturas', schema: 'public' })
export class Cultura {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    @Generated("uuid")
    @Index()
    idPublic: string;

    @Column({ nullable: false, unique: true })
    nome: string;

    @ManyToMany(() => Safra, safra => safra.culturas)
    @JoinTable({
        name: 'cultura_safra',
        schema: 'public'
    })
    safra: Safra[];

    @ManyToOne(() => Propriedade, propriedade => propriedade.culturas)
    @JoinColumn({ name: 'propriedade_id' })
    propriedade: Propriedade;
}
