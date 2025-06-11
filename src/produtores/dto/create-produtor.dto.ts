import { IsCPFOrCNPJ } from "brazilian-class-validator";
import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from "class-validator";
import { Propriedade } from "src/propriedades/entities/propriedade.entity";
import { IdDto } from "src/utils/id.dto";

export class CreateProdutoreDto {
    @IsNotEmpty({ message: "O 'nome' deve ser informado." })
    @MinLength(4, { message: "O 'nome' deve ser válido." })
    nome: string;

    @IsNotEmpty({ message: "O 'CPF/CNPJ' deve ser informado." })
    @IsCPFOrCNPJ({ message: "O 'CPF/CNPJ' deve ser válido." })
    documento: string;

    @IsOptional()
    @IsBoolean({ message: "O 'ativo' deve ser verdadeiro ou falso." })
    ativo?: boolean;

    @Type(() => IdDto)
    @ValidateNested({ message: " O id da 'propriedade' deve ser informado." })
    propriedade: Propriedade;

    @IsOptional()
    @IsString({ message: "O 'createBy' deve ser uma string." })
    createdBy?: string;
}
