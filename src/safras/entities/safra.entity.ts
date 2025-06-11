import { Cultura } from "src/culturas/entities/cultura.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('safras')
export class Safra {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    nome: string;

    @OneToMany(() => Cultura, cultura => cultura.safra)
    culturas: Cultura[];
}
