import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import PermissionGuard from 'src/auth/guards/permission.guard';
import { ResponseGeneric } from 'src/utils/response.generic';
import DashboardPermission from '../enum/dashboardPermission.enum';
import { DashboardService } from '../service/dashboard.service';

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
  async findAllProdutor(@Param('idProdutor') idProdutor: number) {
    return await this.dashboardService.findAllProdutor(idProdutor);
  }

}
