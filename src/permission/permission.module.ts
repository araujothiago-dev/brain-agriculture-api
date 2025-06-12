import { Module } from '@nestjs/common';
import { PermissionService } from './service/permission.service';
import { PermissionController } from './controller/permission.controller';
import { Permission } from './entities/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission])
  ],
  controllers: [PermissionController],
  providers: [PermissionService]
})
export class PermissionModule {}
