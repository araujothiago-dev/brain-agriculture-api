import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from "class-validator";
import { Propriedade } from "src/propriedades/entities/propriedade.entity";
import { Safra } from "src/safras/entities/safra.entity";
import { IdDto } from "src/utils/id.dto";

export class CreateCulturaDto {
    @IsNotEmpty({ message: "O 'nome' deve ser informado." })
    @IsString({ message: "O 'nome' deve ser uma string." })
    nome: string;

    @IsOptional()
    @IsBoolean({ message: "O 'ativo' deve ser verdadeiro ou falso." })
    ativo?: boolean;

    @Type(() => IdDto)
    @ValidateNested({ message: " O id do 'produtor' deve ser informado." })
    propriedade: Propriedade[];

    @Type(() => IdDto)
    @ValidateNested({ message: " O id da 'safra' deve ser informado." })
    safras: Safra[];
}
