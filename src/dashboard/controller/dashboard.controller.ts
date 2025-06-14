import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseGeneric } from 'src/utils/response.generic';
import { DashboardService } from '../service/dashboard.service';
import PermissionGuard from 'src/auth/guards/permission.guard';
import DashboardPermission from '../enum/dashboardPermission.enum';

@ApiBearerAuth('access_token')
@ApiTags('dashboard')
@ApiResponse({type: ResponseGeneric})
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @UseGuards(PermissionGuard(DashboardPermission.LER_DASHBOARD, false))
  async findAllAdmin() {
    return await this.dashboardService.findAllAdmin();
  }

  @Get('produtor/:idProdutor')
  @UseGuards(PermissionGuard(DashboardPermission.LER_DASHBOARD, false))
  async findAllProdutor(@Query('idProdutor') idProdutor: string) {
    return await this.dashboardService.findAllProdutor(idProdutor);
  }

}
