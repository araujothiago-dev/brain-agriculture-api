import { Column, DeleteDateColumn, Entity, Generated, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Municipio } from './../../municipio/entities/municipio.entity';

@Entity({ name: 'estado', schema: 'public' })
export class Estado {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: false, unique: true })
	@Generated("uuid")
	@Index()
	idPublic: string;

	@Column({ nullable: false })
	nome: string;

	@Column({ nullable: false })
	sigla: string;

	@OneToMany(() => Municipio, municipio => municipio.estado)
	municipio: Municipio[];

	@DeleteDateColumn({ select: false })
	dataDelete: Date;

	@Column({ default: 0, nullable: false, select: false })
	isDelete: number;
}
