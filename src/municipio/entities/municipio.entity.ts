import { Estado } from "src/estado/entities/estado.entity";
import { Propriedade } from "src/propriedades/entities/propriedade.entity";
import { Column, Entity, Generated, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'municipio', schema: 'public', orderBy: { nome: "ASC" }})
export class Municipio {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    @Generated("uuid")
    @Index()
    idPublic: string;

    @Column({ nullable: false })
    nome: string;

    @Column({ nullable: false, default: false })
    ativo: boolean;

    @ManyToOne(() => Estado, estado => estado.municipio, { eager: true, nullable: false })
    @JoinColumn({ name: 'estado_id' })
    estado: Estado;

    @OneToMany(() => Propriedade, propriedade => propriedade.cidade)
	propriedades: Propriedade[];

}
