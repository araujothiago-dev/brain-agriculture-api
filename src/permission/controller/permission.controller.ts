import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PermissionService } from '../service/permission.service';
import PermissionsPermission from '../enums/permissionsPermission.enum';
import PermissionGuard from 'src/auth/guards/permission.guard';
import { ResponseGeneric } from 'src/utils/response.generic';
import { Permission } from '../entities/permission.entity';
import { FindOneParams } from 'src/utils/findOne.params';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access_token')
@ApiTags('permission')
@ApiResponse({type: ResponseGeneric<Permission>})
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}


  @Get()
  @UseGuards(PermissionGuard(PermissionsPermission.LER_PERMISSIONS))
  async findAll(): Promise<ResponseGeneric<Permission[]>> {
    return await this.permissionService.findAll();
  }

  @Get(':idPublic')
  @UseGuards(PermissionGuard(PermissionsPermission.LER_PERMISSIONS))
  async findOne(@Param() {idPublic}: FindOneParams): Promise<ResponseGeneric<Permission>> {
    return await this.permissionService.findOne(idPublic);
  }
}
