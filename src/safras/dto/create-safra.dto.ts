import { IsNotEmpty } from "class-validator";

export class CreateSafraDto {
    @IsNotEmpty()
    nome: string
}
