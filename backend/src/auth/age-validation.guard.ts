// backend/src/auth/age-validation.guard.ts - Middleware para validar edad
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Auth0Service } from './auth0.service';

// Decorator para especificar la edad mínima requerida
export const MinAge = (age: number) => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('minAge', age, descriptor.value);
  };
};

// Decorator para especificar si requiere supervisión parental
export const RequiresSupervision = () => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('requiresSupervision', true, descriptor.value);
  };
};

@Injectable()
export class AgeValidationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private auth0Service: Auth0Service
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    
    // Obtener metadatos de edad requerida
    const minAge = this.reflector.get<number>('minAge', handler);
    const requiresSupervision = this.reflector.get<boolean>('requiresSupervision', handler);
    
    // Si no hay restricciones de edad, permitir acceso
    if (!minAge && !requiresSupervision) {
      return true;
    }

    // Verificar que el usuario esté autenticado
    if (!request.user || !request.user.sub) {
      throw new HttpException('Usuario no autenticado', HttpStatus.UNAUTHORIZED);
    }

    try {
      // Obtener información del usuario desde Auth0
      const userInfo = await this.auth0Service.getUserInfo(request.user.sub);
      const userAge = userInfo.user_metadata?.edad;
      
      // Verificar que el usuario tenga edad registrada
      if (!userAge) {
        throw new HttpException(
          'Debe completar la información de edad para acceder a esta funcionalidad',
          HttpStatus.BAD_REQUEST
        );
      }

      // Validar edad mínima si está especificada
      if (minAge && userAge < minAge) {
        throw new HttpException(
          `Debe tener al menos ${minAge} años para acceder a esta funcionalidad`,
          HttpStatus.FORBIDDEN
        );
      }

      // Validar supervisión parental para menores de 14
      if (userAge < 14) {
        const hasParentalConsent = userInfo.user_metadata?.autorizacionParental;
        
        if (!hasParentalConsent) {
          throw new HttpException(
            'Los menores de 14 años requieren autorización parental explícita',
            HttpStatus.FORBIDDEN
          );
        }
        
        // Si requiere supervisión y es menor de 14, verificar supervisión activa
        if (requiresSupervision) {
          // Aquí podrías implementar lógica adicional para verificar supervisión activa
          // Por ejemplo, verificar que un adulto esté presente o que haya confirmación reciente
          
          // Por ahora, solo registramos el acceso de menores
          console.log(`⚠️ Menor de 14 años accediendo a funcionalidad supervisada: ${request.user.sub}`);
        }
      }

      // Agregar información de edad al request para uso posterior
      request.userAge = userAge;
      request.ageGroup = this.getAgeGroup(userAge);
      request.requiresSupervision = userAge < 18;

      return true;

    } catch (error: any) {
      console.error(`❌ Error validando edad para usuario ${request.user.sub}:`, error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Error verificando información de edad',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private getAgeGroup(age: number): string {
    if (age < 14) return 'child';
    if (age < 18) return 'teenager';
    return 'adult';
  }
}

// Ejemplo de uso en controladores:
/*
import { UseGuards } from '@nestjs/common';
import { AgeValidationGuard, MinAge, RequiresSupervision } from './age-validation.guard';

@Controller('games')
@UseGuards(JwtAuthGuard, AgeValidationGuard)
export class GamesController {

  @Get('basic')
  // Sin restricción de edad - accesible para todos los usuarios autenticados
  getBasicGames() {
    return this.gamesService.getBasicGames();
  }

  @Get('advanced')
  @MinAge(14)
  // Solo usuarios de 14 años o más
  getAdvancedGames() {
    return this.gamesService.getAdvancedGames();
  }

  @Get('multiplayer')
  @MinAge(16)
  // Solo usuarios de 16 años o más
  getMultiplayerGames() {
    return this.gamesService.getMultiplayerGames();
  }

  @Post('report-progress')
  @RequiresSupervision()
  // Requiere supervisión para menores - registra el acceso
  reportProgress(@Request() req, @Body() progressData: any) {
    const { userAge, ageGroup } = req;
    return this.gamesService.reportProgress(req.user.sub, progressData, { userAge, ageGroup });
  }
}
*/