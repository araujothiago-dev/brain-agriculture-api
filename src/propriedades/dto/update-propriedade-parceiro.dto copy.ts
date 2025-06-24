import { OmitType } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreatePropriedadeDto } from './create-propriedade.dto';

export class UpdatePropriedadeParceiroDto extends OmitType(CreatePropriedadeDto, ['matricula', 'cidade'] as const) {
    @IsOptional()
    @IsNumber({}, { message: "O 'id' deve ser um número." })
    id?: number;

    @IsOptional()
    @IsUUID(4, { message: "O 'idPublic' deve ser válido." })
    idPublic?: string;

    @IsOptional()
    @IsDate({ message: "O 'updatedAt' deve ser uma data." })
    updatedAt?: Date;

    @IsOptional()
    @IsString({ message: "O 'updatedBy' deve ser uma string." })
    updatedBy?: string;
}
