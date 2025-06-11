import { Propriedade } from "src/propriedades/entities/propriedade.entity";
import { BaseEntity } from "src/utils/entities/base.entity";
import { Column, Entity, Generated, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('produtores')
export class Produtor extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    @Generated("uuid")
    @Index()
    idPublic: string;

    @Column({ nullable: false })
    nome: string;

    @Column({ nullable: false, unique: true })
    documento: string;

    @Column({ nullable: false, default: true })
    ativo: boolean;

    @OneToMany(() => Propriedade, propriedade => propriedade.produtor)
    propriedades: Propriedade[];
}
