import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { DataSource } from "typeorm";
import { seedCultura } from "./seedCultura";
import { seedProdutores } from "./seedProdutores";
import { seedPropriedades } from "./seedPropriedades";
import { seedSafra } from "./seedSafra";

export async function seeds(dataSource: DataSource) {
    const logger = new Logger('SeedSafras');
    const app = await NestFactory.createApplicationContext(AppModule);
    try {
        logger.log('Inserindo safras...');
        await seedSafra(dataSource,  app);
        logger.log('Safras inseridas com sucesso.');

        logger.log('Inserindo cultura...');
        await seedCultura(dataSource,  app);
        logger.log('Culturas inseridas com sucesso.');

        logger.log('Inserindo produtores...');
        await seedProdutores(dataSource,  app);
        logger.log('Produtores inseridos com sucesso.');
        
        logger.log('Inserindo propriedades...');
        await seedPropriedades(dataSource,  app);
        logger.log('Propriedades inseridas com sucesso.');

    } catch (error) {
        logger.error('Erro ao executar o seed:', error);
    } finally {
        await app.close();
        await dataSource.destroy();
    }
}