import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, ValidateNested } from "class-validator";
import { Municipio } from "src/municipio/entities/municipio.entity";
import { Produtor } from "src/produtores/entities/produtor.entity";
import { IdDto } from "src/utils/id.dto";
import { CulturaSafraInputDto } from "./create-propriedade-cultura.dto";

export class CreatePropriedadeDto {
    @IsNotEmpty({ message: "O 'nome' deve ser informado." })
    @MinLength(4, { message: "O 'nome' deve ser válido." })
    nome: string;

    @IsNotEmpty({ message: "A 'matrícula do imóvel' deve ser informada." })
    @IsNumber({}, { message: "A 'matrícula do imóvel' deve ser um número." })
    matricula: number;

    @Type(() => IdDto)
    @ValidateNested({ message: " O id da 'cidade' deve ser informado." })
    cidade: Municipio;

    @IsNotEmpty({ message: "A 'área total' deve ser informada." })
    @IsNumber({}, { message: "A 'área total' deve ser um número." })
    areaTotal: number;

    @IsNotEmpty({ message: "A 'área agricultável' deve ser informada." })
    @IsNumber({}, { message: "A 'área agricultável' deve ser um número." })
    areaAgricultavel: number;

    @IsNotEmpty({ message: "A 'área de vegetação' deve ser informada." })
    @IsNumber({}, { message: "A 'área de vegetação' deve ser um número." })
    areaVegetacao: number;

    @IsOptional()
    @IsBoolean({ message: "O 'ativo' deve ser verdadeiro ou falso." })
    ativo?: boolean;

    @Type(() => IdDto)
    @ValidateNested({ message: " O id do 'produtor' deve ser informado." })
    produtor: Produtor;

    
    @IsOptional()
    @IsArray()
    @Type(() => CulturaSafraInputDto)
    @ValidateNested({ each: true })
    culturas?: CulturaSafraInputDto[];

    @IsOptional()
    @IsString({ message: "O 'createdBy' deve ser uma string." })
    createdBy?: string;
}
