import { PartialType } from '@nestjs/mapped-types';
import { CreateSafraDto } from './create-safra.dto';

export class UpdateSafraDto extends PartialType(CreateSafraDto) {}
