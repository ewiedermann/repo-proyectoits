// backend/src/common/interceptors/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, headers } = request;
    const userAgent = headers['user-agent'] || 'Unknown';
    
    // No loguear tokens por seguridad
    const sanitizedHeaders = { ...headers };
    if (sanitizedHeaders.authorization) {
      sanitizedHeaders.authorization = 'Bearer [REDACTED]';
    }

    this.logger.log(`📥 ${method} ${url} - ${userAgent}`);
    
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log(`📤 ${method} ${url} - ${duration}ms`);
      })
    );
  }
}

// Uso en main.ts (agregar después de la configuración de pipes):
// app.useGlobalInterceptors(new LoggingInterceptor());