import { PropriedadeCulturaSafra } from "src/propriedadeCulturaSafra/propriedadeCulturaSafra.entity";
import { Column, Entity, Generated, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'safras', schema: 'public' })
export class Safra {
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

    @OneToMany(() => PropriedadeCulturaSafra, pcs => pcs.safra)
    propriedadesCulturas: PropriedadeCulturaSafra[];
}
