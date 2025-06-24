import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<any> {
    const returnData = await super.canActivate(context);
    
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const body = request.body;
    if(body) {
      request.body.userToken = request.user;
  
      switch (method) {
        case 'POST':
          body.createdBy = request.user.idPublic;
          break;
        case 'PATCH':
        case 'DELETE':
          body.updatedBy = request.user.idPublic;
          break;
      }
    }
    
    return returnData;
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException('Login necessário.');
    }

    return user;
  }
}