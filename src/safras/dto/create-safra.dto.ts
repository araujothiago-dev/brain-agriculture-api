import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { IdDto } from "src/utils/id.dto";
import { Cultura } from '../../culturas/entities/cultura.entity';

export class CreateSafraDto {
    @IsNotEmpty({ message: "O 'nome' deve ser informado." })
    @IsString({ message: "O 'nome' deve ser uma string." })
    nome: string;

    @IsOptional()
    @IsBoolean({ message: "O 'ativo' deve ser verdadeiro ou falso." })
    ativo?: boolean;

    @IsArray()
    @Type(() => IdDto)
    @ValidateNested({ message: " O id da 'cultura' deve ser informado." })
    culturas?: Cultura[];
}
