import { PickType } from "@nestjs/swagger";

import { CreateUsuarioDto } from './create-usuario.dto';

export class LoginUsuarioDto extends PickType(CreateUsuarioDto, ['email', 'senha'] as const) {}
