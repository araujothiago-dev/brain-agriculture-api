import { Perfil } from "src/perfil/entities/perfil.entity";
import { Produtor } from "src/produtores/entities/produtor.entity";
import { BaseEntity } from "src/utils/entities/base.entity";
import { Column, DeleteDateColumn, Entity, Generated, Index, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: 'usuario', schema: 'security' })
@Unique('UQ_DELETE', ['email', 'cpfCnpj', 'dataDelete'])
export class Usuario extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    @Generated("uuid")
    @Index()
    idPublic: string;

    @Column({ nullable: false })
    nome: string;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false, unique: true })
    cpfCnpj: string;

    @Column({ nullable: false, select: false })
    senha: string;

    @Column({ nullable: false, default: true })
    ativo: boolean;

    @ManyToMany(() => Perfil, perfil => perfil.usuario, { eager: true })
    @JoinTable({
        name: 'usuario_perfil',
        schema: 'security'
    })
    perfil: Perfil[];

    @OneToOne(() => Produtor, produtor => produtor.usuario, { nullable: true })
    produtor?: Produtor;

    @Column({ nullable: true })
    lastAccess: Date;

    @Column({ nullable: true })
    firstAccess: Date;

    @DeleteDateColumn()
    dataDelete: Date;
}
