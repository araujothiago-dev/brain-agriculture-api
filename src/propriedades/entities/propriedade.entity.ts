import { Municipio } from "src/municipio/entities/municipio.entity";
import { Produtor } from "src/produtores/entities/produtor.entity";
import { PropriedadeCulturaSafra } from "src/propriedadeCulturaSafra/propriedadeCulturaSafra.entity";
import { BaseEntity } from "src/utils/entities/base.entity";
import { Column, Entity, Generated, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'propriedades', schema: 'public' })
export class Propriedade extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    @Generated("uuid")
    @Index()
    idPublic: string;

    @Column({ nullable: false })
    nome: string;

    @ManyToOne(() => Municipio, municipio => municipio.propriedades, { eager: true, nullable: false })
    @JoinColumn({ name: 'cidade_id' })
    cidade: Municipio;

    @Column({ nullable: false, type: 'float' })
    areaTotal: number;

    @Column({ nullable: false, type: 'float' })
    areaAgricultavel: number;

    @Column({ nullable: false, type: 'float' })
    areaVegetacao: number;

    @Column({ nullable: false, default: true })
    ativo?: boolean;

    @ManyToOne(() => Produtor, produtor => produtor.propriedades)
    @JoinColumn({ name: 'produtor_id' })
    produtor: Produtor;

    @OneToMany(() => PropriedadeCulturaSafra, pcs => pcs.propriedade)
    culturasSafras: PropriedadeCulturaSafra[];
}
