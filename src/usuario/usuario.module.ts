import { Module } from '@nestjs/common';
import { UsuarioService } from './service/usuario.service';
import { UsuarioController } from './controller/usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassVerify } from 'src/utils/pass-verify/passVerify';
import { CpfCnpjVerify } from 'src/utils/cpf-cnpj-verify/cpf-cnpj-verify';
// import { UsuarioSubscriber } from './subscriber/usuario.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    JwtModule.register({}),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService, PassVerify, CpfCnpjVerify],
  exports: [UsuarioService]
})
export class UsuarioModule {}
