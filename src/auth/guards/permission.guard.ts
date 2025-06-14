import { CanActivate, ExecutionContext, mixin, Type, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Permission } from 'src/permission/entities/permission.entity';
import { Perfil } from 'src/perfil/entities/perfil.entity';
 
const PermissionGuard = (permission: any, allowContext: boolean = false): Type<CanActivate> => {
  class PermissionGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext): Promise<any> {
      const returnData = await super.canActivate(context);

      if (!returnData) {
        throw new UnauthorizedException('Não foi possível verificar autorização do Usuário.');        
      }
      
      const request = context.switchToHttp().getRequest();
      const usuario: Usuario = request.user;
      const params = request.params;
      const perfil: Perfil = usuario?.perfil;
      const permissions: Permission[] = [];
      perfil.permission.forEach(p => {
          permissions.push(p);
      });

			if (!(permissions.some(p => p.nome == permission)) && !(allowContext == true && params?.idPublic == usuario.idPublic)) {
        throw new UnauthorizedException('Usuário sem autorização.');
      }
      
      return returnData;
    }
  }
	
  return mixin(PermissionGuardMixin);
}
 
export default PermissionGuard;