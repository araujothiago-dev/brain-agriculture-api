import { Cultura } from "src/culturas/entities/cultura.entity";
import { Column, Entity, Generated, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('safras')
export class Safra {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    @Generated("uuid")
    @Index()
    idPublic: string;

    @Column({ nullable: false, unique: true })
    nome: string;

    @ManyToMany(() => Cultura, cultura => cultura.safra)
    @JoinTable({
        name: 'cultura_safra'
    })
    culturas: Cultura[];

}
