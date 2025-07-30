// backend/src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message || 'Internal server error',
      error: HttpStatus[status] || 'Unknown Error',
    };

    // Log del error para debugging
    console.error(`${errorResponse.method} ${errorResponse.path} - ${status} - ${errorResponse.message}`);

    response.status(status).json(errorResponse);
  }
}

// Uso en main.ts (agregar después de la configuración de CORS):
// app.useGlobalFilters(new HttpExceptionFilter());
