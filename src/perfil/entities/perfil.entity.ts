import { Column, Entity, Generated, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Usuario } from 'src/usuario/entities/usuario.entity';
import { BaseEntity } from 'src/utils/entities/base.entity';
import { Permission } from './../../permission/entities/permission.entity';

@Entity({ name: 'perfil', schema: 'security' })
export class Perfil extends BaseEntity{
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: false, unique: true })
	@Generated('uuid')
	@Index()
	idPublic: string;

	@Column({ unique: true, nullable: false })
	nome: string;

	@Column({ nullable: false, default: true })
	ativo: boolean;

	@ManyToMany(() => Permission, permission => permission.perfil, { eager: true })
	@JoinTable({
		name: 'perfil_permission',
		schema: 'security'
	})
	permission: Permission[];

	@OneToMany(() => Usuario, usuario => usuario.perfil)
	usuario: Usuario[];
}
