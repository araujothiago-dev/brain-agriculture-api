import { Propriedade } from "src/propriedades/entities/propriedade.entity";
import { Usuario } from "src/usuario/entities/usuario.entity";
import { BaseEntity } from "src/utils/entities/base.entity";
import { Column, DeleteDateColumn, Entity, Generated, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'produtores', schema: 'public' })
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
    cpfCnpj: string;

    @Column({ nullable: false, default: true })
    ativo: boolean;

    @OneToMany(() => Propriedade, propriedade => propriedade.produtor)
    propriedades: Propriedade[];

    @OneToOne(() => Usuario, usuario => usuario.produtor, { eager: true })
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;

    @DeleteDateColumn()
    dataDelete: Date;
}
