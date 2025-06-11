import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseGeneric } from 'src/utils/response.generic';
import { DashboardService } from '../service/dashboard.service';

@ApiTags('dashboard')
@ApiResponse({type: ResponseGeneric})
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  async findAllAdmin() {
    return await this.dashboardService.findAllAdmin();
  }

  @Get('produtor/:idProdutor')
  async findAllProdutor(@Query('idProdutor') idProdutor: string) {
    return await this.dashboardService.findAllProdutor(idProdutor);
  }

}
