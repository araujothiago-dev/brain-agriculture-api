import { Logger } from "@nestjs/common";
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables2025612142799 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const logger = new Logger('CreateTables2025612142799');

		try {
			logger.log('Iniciando create schema...');

			await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS public`);
			await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS security`);

			await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

			logger.log('Iniciando create table permission...');
			await queryRunner.query(`
				CREATE TABLE security.permission (
					id SERIAL PRIMARY KEY,
					id_public UUID NOT NULL UNIQUE,
					nome VARCHAR NOT NULL UNIQUE,
					descricao VARCHAR NOT NULL UNIQUE,
					ativo BOOLEAN NOT NULL DEFAULT true,
					created_at TIMESTAMP DEFAULT now(),
					updated_at TIMESTAMP DEFAULT now()
				)
			`);

			await queryRunner.query(`
				CREATE INDEX IDX_permission_id_public ON security.permission(id_public);
			`);

			logger.log('Iniciando create table perfil...');
			await queryRunner.query(`
				CREATE TABLE security.perfil (
					id SERIAL PRIMARY KEY,
					id_public UUID NOT NULL UNIQUE,
					nome VARCHAR NOT NULL UNIQUE,
					ativo BOOLEAN NOT NULL DEFAULT true,
					created_at TIMESTAMP DEFAULT now(),
					updated_at TIMESTAMP DEFAULT now()
					)
			`);

			await queryRunner.query(`
				CREATE INDEX IDX_perfil_id_public ON security.perfil(id_public);
			`);

			logger.log('Iniciando create table perfil_permission...');
			await queryRunner.query(`
				CREATE TABLE security.perfil_permission (
					perfil_id INTEGER NOT NULL,
					permission_id INTEGER NOT NULL,
					PRIMARY KEY (perfil_id, permission_id),
					CONSTRAINT FK_perfil FOREIGN KEY (perfil_id) REFERENCES security.perfil(id) ON DELETE CASCADE,
					CONSTRAINT FK_permission FOREIGN KEY (permission_id) REFERENCES security.permission(id) ON DELETE CASCADE
				)
			`);

			await queryRunner.query(`
				CREATE INDEX IDX_perfil_permission_perfil_id ON security.perfil_permission(perfil_id);
				CREATE INDEX IDX_perfil_permission_permission_id ON security.perfil_permission(permission_id);
			`);

			logger.log('Iniciando create table usuario...');
			await queryRunner.query(`
				CREATE TABLE security.usuario (
					id SERIAL PRIMARY KEY,
					id_public UUID NOT NULL UNIQUE,
					nome VARCHAR NOT NULL,
					email VARCHAR NOT NULL UNIQUE,
					cpf_cnpj VARCHAR NOT NULL UNIQUE,
					senha VARCHAR NOT NULL,
					ativo BOOLEAN NOT NULL DEFAULT true,
					perfil_id INTEGER,
					produtor_id INTEGER,
					last_access TIMESTAMP,
					first_access TIMESTAMP,
					data_delete TIMESTAMP,
					created_at TIMESTAMP DEFAULT now(),
					updated_at TIMESTAMP DEFAULT now(),
					CONSTRAINT FK_usuario_perfil FOREIGN KEY (perfil_id) REFERENCES security.perfil(id)
				)
			`);

			await queryRunner.query(`
				CREATE INDEX IDX_usuario_id_public ON security.usuario(id_public);
				CREATE INDEX IDX_usuario_email ON security.usuario(email);
				CREATE INDEX IDX_usuario_cpf_cnpj ON security.usuario(cpf_cnpj);
			`);

			logger.log('Iniciando alter table usuario...');

			await queryRunner.query(`
				ALTER TABLE security.usuario
				ADD CONSTRAINT UQ_DELETE UNIQUE (email, cpf_cnpj, data_delete)
			`);

			logger.log('Iniciando create table estado...');
			await queryRunner.query(`
				CREATE TABLE public.estado (
					id SERIAL PRIMARY KEY,
					id_public UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
					nome VARCHAR NOT NULL,
					sigla VARCHAR NOT NULL,
					data_delete TIMESTAMP,
					is_delete INTEGER NOT NULL DEFAULT 0,
					created_at TIMESTAMP DEFAULT now(),
					updated_at TIMESTAMP DEFAULT now()
					);
			`);

			await queryRunner.query(`
				CREATE INDEX IDX_estado_id_public ON public.estado(id_public);
			`);

			logger.log('Iniciando create table município...');
			await queryRunner.query(`
				CREATE TABLE public.municipio (
					id SERIAL PRIMARY KEY,
					id_public UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
					nome VARCHAR NOT NULL,
					ativo BOOLEAN NOT NULL DEFAULT false,
					estado_id INTEGER NOT NULL,
					created_at TIMESTAMP DEFAULT now(),
					updated_at TIMESTAMP DEFAULT now(),
					CONSTRAINT FK_municipio_estado FOREIGN KEY (estado_id) REFERENCES public.estado(id)
					);
				`);

			await queryRunner.query(`
				CREATE INDEX IDX_municipio_id_public ON public.municipio(id_public);
			`);

		} catch (error) {
			logger.error('Erro ao executar migration CreateTables2025612142799', error.message);
			throw error;
		}

	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.clearTable('public.estado');
		await queryRunner.clearTable('public.municipio');
		await queryRunner.clearTable('security.perfil');
		await queryRunner.clearTable('security.permission');
		await queryRunner.clearTable('security.perfil_permission');
		await queryRunner.clearTable('security.usuario');
		await queryRunner.query(`DROP SCHEMA IF EXISTS security CASCADE`);
		await queryRunner.query(`DROP SCHEMA IF EXISTS public CASCADE`);
	}

}
