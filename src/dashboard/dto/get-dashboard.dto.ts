import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class GetDashboardDto {

    @IsOptional()
    @IsNumber({}, { message: "O 'total de fazendas' deve ser um número." })
    totalFazendas?: number;

    @IsOptional()
    @IsNumber({}, { message: "O 'total por estado' deve ser um número." })
    porEstado?: number;

    @IsOptional()
    @IsNumber({}, { message: "O 'total por estado' deve ser um número." })
    totalHectares?: number;

    @IsOptional()
    @IsNumber({}, { message: "O 'total por cultura' deve ser um número." })
    porCultura?: number;

    @IsOptional()
    @IsNumber({}, { message: "A 'área agriculturavel' deve ser um número." })
    area_agricultavel?: number;

    @IsOptional()
    @IsNumber({}, { message: "A 'área vegetacao' deve ser um número." })
    area_vegetacao?: number;

}
