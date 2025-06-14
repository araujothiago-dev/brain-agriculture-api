import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { CpfCnpjVerify } from 'src/utils/cpf-cnpj-verify/cpf-cnpj-verify';
import { ProdutoresController } from './controllers/produtores.controller';
import { Produtor } from './entities/produtor.entity';
import { ProdutoresService } from './services/produtores.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Produtor]),
    UsuarioModule
  ],
  controllers: [ProdutoresController],
  providers: [ProdutoresService, CpfCnpjVerify],
  exports: [ProdutoresService],
})
export class ProdutoresModule {}
