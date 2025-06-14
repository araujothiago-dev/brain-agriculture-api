import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { IdDto } from "src/utils/id.dto";

export class CulturaSafraInputDto {
  @Type(() => IdDto)
  @ValidateNested()
  culturaId: IdDto;

  @IsOptional()
  @Type(() => IdDto)
  @ValidateNested()
  safrasId?: IdDto;
}
