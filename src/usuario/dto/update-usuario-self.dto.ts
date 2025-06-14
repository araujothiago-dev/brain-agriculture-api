import { OmitType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty } from 'class-validator';

import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioSelfDto extends OmitType(CreateUsuarioDto, ['senha', 'createdBy', 'email', 'perfil'] as const) {
  @IsNotEmpty({ message: "O 'updateBy' deve ser informado." })
  @IsString({ message: "O 'updateBy' deve ser uma string." })
  updatedBy: string;
}
