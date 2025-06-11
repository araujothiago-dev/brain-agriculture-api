import { Cultura } from "src/culturas/entities/cultura.entity";
import { Produtor } from "src/produtores/entities/produtor.entity";
import { BaseEntity } from "src/utils/entities/base.entity";
import { Column, Entity, Generated, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('propriedades')
export class Propriedade extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    @Generated("uuid")
    @Index()
    idPublic: string;

    @Column({ nullable: false })
    nome: string;

    @Column({ nullable: false })
    cidade: string;

    @Column({ nullable: false })
    estado: string;

    @Column({ nullable: false, type: 'float' })
    area_total: number;

    @Column({ nullable: false, type: 'float' })
    area_agricultavel: number;

    @Column({ nullable: false, type: 'float' })
    area_vegetacao: number;

    @Column({ nullable: false, default: true })
    ativo?: boolean;

    @ManyToOne(() => Produtor, produtor => produtor.propriedades)
    produtor: Produtor;

    @OneToMany(() => Cultura, cultura => cultura.propriedade, { cascade: true })
    culturas: Cultura[];
}
