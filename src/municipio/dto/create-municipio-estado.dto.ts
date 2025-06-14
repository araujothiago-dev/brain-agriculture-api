import { OmitType } from "@nestjs/mapped-types";

import { CreateMunicipioDto } from "./create-municipio.dto";

export class CreateMunicipioEstadoDto extends OmitType(CreateMunicipioDto, ['estado'] as const) {}