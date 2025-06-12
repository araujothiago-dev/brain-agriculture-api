import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

import { Municipio } from 'src/municipio/entities/municipio.entity';

import { CreateMunicipioEstadoDto } from "src/municipio/dto/create-municipio-estado.dto";

export class CreateEstadoDto {
    @IsNotEmpty({ message: "O 'nome' deve ser informado." })
    @IsString({ message: "O 'nome' deve ser um texto." })
    nome: string;

    @IsNotEmpty({ message: "A 'sigla' deve ser informada." })
    @IsString({ message: "A 'sigla' deve ser um texto." })
    sigla: string;

    @ValidateNested({ each: true })
    @Type(() => CreateMunicipioEstadoDto)
    municipio: Municipio[];
}