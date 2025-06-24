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
      .select([
        'COUNT(p.id) AS propriedades',
        'SUM(p.area_total) AS total_hectares',
        'SUM(p.area_agricultavel) AS area_agricultavel',
        'SUM(p.area_vegetacao) AS area_vegetacao',
      ]).from('propriedades', "p")
      .addSelect(subQuery => {
        return subQuery
          .select('COUNT(DISTINCT e.id)', 'totalEstados')
          .from('propriedades', 'p3')
          .leftJoin('municipio', 'm', 'p3.cidade_id = m.id')
          .leftJoin('estado', 'e', 'm.estado_id = e.id');
      }, 'totalEstados')
      .addSelect(subQuery => {
        return subQuery
          .select('COUNT(DISTINCT c.nome)', 'totalCulturas')
          .from('propriedades', 'p2')
          .leftJoin('propriedade_cultura_safra', 'pc', 'p2.id = pc.propriedade_id')
          .leftJoin('culturas', 'c', 'pc.cultura_id = c.id');
      }, 'totalCulturas')
      .getRawOne();

      dashboard.totalFazendas = Number(preDashboard.propriedades);
      dashboard.porEstado = Number(preDashboard.totalEstados);
      dashboard.porCultura = Number(preDashboard.totalCulturas);
      dashboard.areaAgricultavel = Number(preDashboard.area_agricultavel);
      dashboard.areaVegetacao = Number(preDashboard.area_vegetacao);
      dashboard.totalHectares = (Number(preDashboard.total_hectares));

      return new ResponseGeneric<GetDashboardDto>(dashboard);
    } catch (error) {
      console.error(error);
      throw new HttpException({ message: 'Não foi possível listar o dashboard. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND);
    }
  }

  async findAllProdutor(idProdutor: number) {
    try {
      let dashboard: GetDashboardDto = new GetDashboardDto();

      const preDashboard = await this.dataSource.createQueryBuilder()
        .select([
          'COUNT(p.id) AS propriedades',
          'SUM(p.area_total) AS total_hectares',
          'SUM(p.area_agricultavel) AS area_agricultavel',
          'SUM(p.area_vegetacao) AS area_vegetacao',
        ]).from('propriedades', "p")
        .addSelect(subQuery => {
          return subQuery
            .select('COUNT(DISTINCT e.id)', 'totalEstados')
            .from('propriedades', 'p3')
            .leftJoin('municipio', 'm', 'p3.cidade_id = m.id')
            .leftJoin('estado', 'e', 'm.estado_id = e.id')
            .where('p3.produtor_id = :idProdutor', { idProdutor });
        }, 'totalEstados')
        .addSelect(subQuery => {
          return subQuery
            .select('COUNT(DISTINCT c.nome)', 'totalCulturas')
            .from('propriedades', 'p2')
            .leftJoin('propriedade_cultura_safra', 'pc', 'p2.id = pc.propriedade_id')
            .leftJoin('culturas', 'c', 'pc.cultura_id = c.id')
            .where('p2.produtor_id = :idProdutor', { idProdutor });
        }, 'totalCulturas')
        .where('p.produtor_id = :idProdutor', { idProdutor })
        .getRawOne();

      dashboard.totalFazendas = Number(preDashboard.propriedades);
      dashboard.porEstado = Number(preDashboard.totalEstados);
      dashboard.porCultura = Number(preDashboard.totalCulturas);
      dashboard.areaAgricultavel = Number(preDashboard.area_agricultavel);
      dashboard.areaVegetacao = Number(preDashboard.area_vegetacao);
      dashboard.totalHectares = (Number(preDashboard.total_hectares));

      return new ResponseGeneric<GetDashboardDto>(dashboard);
    } catch (error) {
      throw new HttpException({ message: 'Não foi possível listar o dashboard. ', code: error?.code, erro: error }, HttpStatus.NOT_FOUND);
    }
  }

}
