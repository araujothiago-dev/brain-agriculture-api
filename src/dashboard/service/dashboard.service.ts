import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Propriedade } from 'src/propriedades/entities/propriedade.entity';
import { IdDto } from 'src/utils/id.dto';
import { ResponseGeneric } from 'src/utils/response.generic';
import { DataSource } from 'typeorm';
import { GetDashboardDto } from '../dto/get-dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    private dataSource: DataSource
  ) { }

  async findAllAdmin() {
    try {

      let dashboard: GetDashboardDto = new GetDashboardDto();

      const preDashboard = await this.dataSource.createQueryBuilder()
        .select(["Count(propriedade.id) as propriedades, Sum(propriedade.area_total) as totalHectares, Sum(propriedade.area_agricultavel) as area_agricultavel, Sum(propriedade.area_vegetacao) as area_vegetacao"]).from(Propriedade, "propriedade")
        .addSelect(subQuery => {
          return subQuery
            .select('COUNT(DISTINCT propriedade.estado)', 'totalEstados')
            .from(Propriedade, 'propriedade');
        }, 'totalEstados')
        .addSelect(subQuery => {
          return subQuery
            .select('COUNT(DISTINCT cultura.nome)', 'totalCulturas')
            .from(Propriedade, 'propriedade')
            .leftJoin('propriedade.culturas', 'cultura');
        }, 'totalCulturas')
        // .from(Propriedade, 'propriedade')
        .getRawOne()

      dashboard.totalFazendas = Number(preDashboard.propriedades);
      dashboard.porEstado = Number(preDashboard.totalEstados);
      dashboard.porCultura = Number(preDashboard.totalCulturas);
      dashboard.area_agricultavel = Number(preDashboard.area_agricultavel);
      dashboard.area_vegetacao = Number(preDashboard.area_vegetacao);
      dashboard.totalHectares = (Number(preDashboard.totalHectares));

      return new ResponseGeneric<GetDashboardDto>(dashboard);
    } catch (error) {
      console.error(error);
      throw new HttpException({ message: 'Não foi possível listar o dashboard. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND);
    }
  }

  async findAllProdutor(idProdutor: string) {
    try {

      let dashboard: GetDashboardDto = new GetDashboardDto();

      const preDashboard = await this.dataSource.createQueryBuilder()
        .select(["Count(propriedade.id) as propriedades, Sum(propriedade.area_total) as totalHectares, Sum(propriedade.area_agricultavel) as area_agricultavel, Sum(propriedade.area_vegetacao) as area_vegetacao"]).from(Propriedade, "propriedade")
        .where("propriedade.idProdutor = :idProdutor", { idProdutor })
        .addSelect(subQuery => {
          return subQuery
            .select('COUNT(DISTINCT propriedade.estado)', 'totalEstados')
            .from(Propriedade, 'propriedade');
        }, 'totalEstados')
        .addSelect(subQuery => {
          return subQuery
            .select('COUNT(DISTINCT cultura.nome)', 'totalCulturas')
            .from(Propriedade, 'propriedade')
            .leftJoin('propriedade.culturas', 'cultura');
        }, 'totalCulturas')
        // .from(Propriedade, 'propriedade')
        .getRawOne()

      dashboard.totalFazendas = Number(preDashboard.propriedades);
      dashboard.porEstado = Number(preDashboard.totalEstados);
      dashboard.porCultura = Number(preDashboard.totalCulturas);
      dashboard.area_agricultavel = Number(preDashboard.area_agricultavel);
      dashboard.area_vegetacao = Number(preDashboard.area_vegetacao);
      dashboard.totalHectares = (Number(preDashboard.totalHectares));

      return new ResponseGeneric<GetDashboardDto>(dashboard);
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível listar o dashboard. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND);
    }
  }

}
