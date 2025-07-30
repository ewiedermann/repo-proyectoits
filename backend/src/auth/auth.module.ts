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