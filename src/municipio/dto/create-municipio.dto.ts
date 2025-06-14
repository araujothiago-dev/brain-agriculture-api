import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional, MinLength, ValidateNested } from "class-validator";
import { Estado } from "src/estado/entities/estado.entity";
import { IdDto } from "src/utils/id.dto";

export class CreateMunicipioDto {
    @IsNotEmpty({ message: "O 'nome' deve ser informado." })
    @MinLength(4, { message: "O 'nome' deve ser valido." })
    nome: string;

    @IsOptional()
    @IsBoolean({ message: "O 'ativo' deve ser verdadeiro ou falso." })
    ativo?: boolean;

    @Type(() => IdDto)
    @ValidateNested({ message: " O id do 'estado' deve ser informado." })
    estado: Estado;
}
