import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = JSON.parse(JSON.stringify(exception.getResponse()));

    switch (error.code) {
      case '23505':
        error.message += 'Já existe um registro igual a este cadastrado.'
        break;
      case '23502':
        error.message += 'Alguns dados nulos são obrigatórios.'
        break;
      case '23503':
        error.message += 'O id de relação informado não existe.'
        break;
      case undefined:
        if (!Array.isArray(error.message)) {
          error.message += (typeof error.erro != 'string' ? JSON.stringify(error.erro) : error.erro) || '';
        }
        break;
    }
    
    response
      .status(status)
      .json({
        data: null,
        message: 'Não foi possível realizar ação.',
        error: (Array.isArray(error.message) ? error.message : [error.message || exception.message]) 
      });
  }
}