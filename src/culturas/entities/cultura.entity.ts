import { PropriedadeCulturaSafra } from "src/propriedadeCulturaSafra/propriedadeCulturaSafra.entity";
import { Propriedade } from "src/propriedades/entities/propriedade.entity";
import { Safra } from "src/safras/entities/safra.entity";
import { Column, DeleteDateColumn, Entity, Generated, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({ nullable: false, default: true })
    ativo: boolean;

    @OneToMany(() => PropriedadeCulturaSafra, pcs => pcs.cultura)
    propriedadesSafras: PropriedadeCulturaSafra[];

    @DeleteDateColumn()
    dataDelete: Date;
}
