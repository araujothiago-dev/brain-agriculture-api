import { PartialType } from '@nestjs/mapped-types';
import { CreateCulturaDto } from './create-cultura.dto';

export class UpdateCulturaDto extends PartialType(CreateCulturaDto) {}
