import { IsNotEmpty } from "class-validator";

export class CreateCulturaDto {
    @IsNotEmpty()
    nome: string;

    propriedadeid: number;

    safraid: number;
}
