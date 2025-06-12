import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, ValidateNested } from "class-validator";
import { Cultura } from "src/culturas/entities/cultura.entity";
import { Municipio } from "src/municipio/entities/municipio.entity";
import { Produtor } from "src/produtores/entities/produtor.entity";
import { IdDto } from "src/utils/id.dto";

export class CreatePropriedadeDto {
    @IsNotEmpty({ message: "O 'nome' deve ser informado." })
    @MinLength(4, { message: "O 'nome' deve ser válido." })
    nome: string;

    @Type(() => IdDto)
    @ValidateNested({ message: " O id do 'municipio' deve ser informado." })
    cidade: Municipio;

    @IsNotEmpty({ message: "A 'área total' deve ser informada." })
    @IsNumber({}, { message: "A 'área total' deve ser um número." })
    area_total: number;

    @IsNotEmpty({ message: "A 'área agricultável' deve ser informada." })
    @IsNumber({}, { message: "A 'área agricultável' deve ser um número." })
    area_agricultavel: number;

    @IsNotEmpty({ message: "A 'área de vegetação' deve ser informada." })
    @IsNumber({}, { message: "A 'área de vegetação' deve ser um número." })
    area_vegetacao: number;

    @IsOptional()
    @IsBoolean({ message: "O 'ativo' deve ser verdadeiro ou falso." })
    ativo?: boolean;

    @Type(() => IdDto)
    @ValidateNested({ message: " O id do 'produtor' deve ser informado." })
    produtor: Produtor;

    @IsArray()
    @Type(() => IdDto)
    @ValidateNested({ message: " O id da 'cultura' deve ser informado."})
    culturas: Cultura[];

    @IsOptional()
    @IsString({ message: "O 'createdBy' deve ser uma string." })
    createdBy?: string;
}
