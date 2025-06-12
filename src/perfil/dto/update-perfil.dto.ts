import { PartialType } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { CreatePerfilDto } from './create-perfil.dto';

export class UpdatePerfilDto extends PartialType(CreatePerfilDto) {
    @IsOptional()
    @IsNumber({}, { message: "O 'id' deve ser um número." })
    id?: number;

    @IsOptional()
    @IsUUID(4, { message: "O 'idPublic' deve ser valido." })
    idPublic?: string;

    @IsOptional()
    @IsDate({ message: "O 'updatedAt' deve ser uma data." })
    updatedAt?: Date;
}
