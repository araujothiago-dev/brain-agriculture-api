import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePassRedefinirDto {
	@IsNotEmpty({ message: "A 'nova senha' deve ser informada." })
	@IsString({ message: "A 'nova senha' deve ser uma string." })
	novaSenha: string;

	@IsNotEmpty({ message: "A 'confirmação da senha' deve ser informada." })
	@IsString({ message: "A 'confirmação da senha' deve ser uma string." })
	confirmacaoSenha: string;
}
