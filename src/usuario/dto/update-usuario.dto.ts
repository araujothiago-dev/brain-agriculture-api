import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Perfil } from 'src/perfil/entities/perfil.entity';
import { IdDto } from 'src/utils/id.dto';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioDto extends OmitType(CreateUsuarioDto, ['senha', 'createdBy', 'cpfCnpj', 'email', 'perfil'] as const) {

    @IsOptional()
    @Type(() => IdDto)
    @ValidateNested({ message: " O id do 'perfil' deve ser informado.", each: true })
    perfil?: Perfil[];

    @IsNotEmpty({ message: "O 'updateBy' deve ser informado." })
    @IsString({ message: "O 'updateBy' deve ser uma string." })
    updatedBy: string;
}
