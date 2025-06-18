import { IsCPFOrCNPJ } from "brazilian-class-validator";
import { Exclude, Transform, Type } from "class-transformer";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf, ValidateNested } from "class-validator";
import { Perfil } from "src/perfil/entities/perfil.entity";
import { IdDto } from "src/utils/id.dto";

export class CreateUsuarioDto {
    @ValidateIf((obj) => obj.nome !== undefined)
    @IsNotEmpty({ message: "O 'nome' deve ser informado." })
    @MinLength(4, { message: "O 'nome' deve ser valido." })
    nome: string;

    @IsNotEmpty({ message: "O 'e-mail' deve ser informado." })
    @Transform(({ value }) => value?.trim())
    @IsEmail({}, { message: "O 'e-mail' deve ser valido." })
    email: string;

    @ValidateIf((obj) => obj.cpfCnpj !== undefined)
    @IsNotEmpty({ message: "O 'CPF/CNPJ' deve ser informado." })
    @IsCPFOrCNPJ({ message: "O 'CPF/CNPJ' deve ser válido." })
    cpfCnpj: string;

    @IsNotEmpty({ message: "A 'senha' deve ser informada." })
    @IsString({ message: "A 'senha' deve ser uma string." })
    @Exclude()
    senha: string;
    
    @IsOptional()
    @IsBoolean({ message: "O 'ativo' deve ser verdadeiro ou falso." })
    ativo?: boolean;

    @IsOptional()
    @IsBoolean({ message: "O 'redefinir pass' deve ser verdadeiro ou falso." })
    redefinirPass?: boolean;

    @IsNotEmpty({ message: "O perfi devem ser informados." })
    @Type(() => IdDto)
    @ValidateNested({ message: " O id do 'perfil' deve ser informado.", each: true })
    perfil: Perfil;

    @IsOptional()
    @IsString({ message: "O 'createBy' deve ser uma string." })
    createdBy?: string;

    @IsOptional()
    updatedBy?: string;
}
