<<<<<<< HEAD
// backend/src/auth/auth.module.ts - Módulo actualizado con nuevas dependencias
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { Auth0Service } from './auth0.service';
import { Auth0Strategy } from './auth.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { EmailVerifiedGuard } from './email-verified.guard';
import { AgeValidationGuard } from './age-validation.guard';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    Auth0Service,
    Auth0Strategy,
    JwtAuthGuard,
    EmailVerifiedGuard,
    AgeValidationGuard,
  ],
  exports: [
    Auth0Service,
    JwtAuthGuard,
    EmailVerifiedGuard,
    AgeValidationGuard,
  ],
})
export class AuthModule {}
=======
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailService } from '../mail/mail.service';
/* Importación de JwtModule: Es necesario importar JwtModule para poder generar y verificar tokens JWT.
 */import { JwtModule } from '@nestjs/jwt';
/*  importacion de ConfigService para usarlo y acceder a las variables de entorno.
 */ import { ConfigModule, ConfigService } from '@nestjs/config'; // Importa ConfigService

 @Module({
  imports: [
    ConfigModule, 
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
  ],
  controllers: [AuthController], // Controlador de autenticación
  providers: [AuthService,MailService],
  exports:[AuthService,MailService]
})
export class AuthModule {}


/* 
ConfigModule debe estar importado en el módulo principal de la aplicación 
para que las variables del .env sean accesibles globalmente.*/
>>>>>>> qa1
