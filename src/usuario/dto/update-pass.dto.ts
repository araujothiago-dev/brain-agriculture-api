import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdatePassDto extends PickType(CreateUsuarioDto, ['senha'] as const) {
	@IsNotEmpty({ message: "A 'nova senha' deve ser informada." })
	@IsString({ message: "A 'nova senha' deve ser uma string." })
	novaSenha: string;
}
