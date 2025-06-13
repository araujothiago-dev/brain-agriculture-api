import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { IdDto } from "src/utils/id.dto";

export class CulturaSafraInputDto {
  @Type(() => IdDto)
  @ValidateNested()
  id: IdDto;

  @IsOptional()
  @Type(() => IdDto)
  @ValidateNested()
  safras?: IdDto;
}
