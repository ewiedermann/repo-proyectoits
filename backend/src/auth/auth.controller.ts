// backend/src/auth/auth.controller.ts - Errores corregidos
import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  UseGuards, 
  Request, 
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiBody,
  ApiProperty
} from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Auth0Service } from './auth0.service';

export class AgeValidationDto {
  @ApiProperty({ 
    description: 'Edad del usuario',
    example: 16,
    minimum: 1,
    maximum: 120
  })
  @IsNumber()
  @Min(1)
  @Max(120)
  edad!: number;

  @ApiProperty({ 
    description: 'Autorización parental para menores de 14 años',
    required: false,
    example: true
  })
  @IsOptional()
  @IsBoolean()
  autorizacionParental?: boolean;

  @ApiProperty({ 
    description: 'Email del padre/tutor (requerido para menores de 14)',
    required: false,
    example: 'padre@ejemplo.com'
  })
  @IsOptional()
  @IsEmail()
  emailTutor?: string;
}

export class RegisterDto {
  @ApiProperty({ 
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez'
  })
  @IsString()
  nombre!: string;

  @ApiProperty({ 
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com'
  })
  @IsEmail()
  email!: string;

  @ApiProperty({ 
    description: 'Edad del usuario',
    example: 16,
    minimum: 1,
    maximum: 120
  })
  @IsNumber()
  @Min(1)
  @Max(120)
  edad!: number;

  @ApiProperty({ 
    description: 'Autorización parental para menores de 14 años',
    required: false,
    example: true
  })
  @IsOptional()
  @IsBoolean()
  autorizacionParental?: boolean;

  @ApiProperty({ 
    description: 'Email del padre/tutor (requerido para menores de 14)',
    required: false,
    example: 'padre@ejemplo.com'
  })
  @IsOptional()
  @IsEmail()
  emailTutor?: string;
}

export class LoginDto {
  @ApiProperty({ 
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com'
  })
  @IsEmail()
  email!: string;

  @ApiProperty({ 
    description: 'Contraseña del usuario',
    example: 'miContraseña123'
  })
  @IsString()
  password!: string;
}

export class ResendVerificationDto {
  @ApiProperty({ 
    description: 'ID del usuario (opcional, se usa el del token si no se proporciona)',
    required: false,
    example: 'auth0|123456789'
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth0Service: Auth0Service) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Registrar nuevo usuario con validación de edad',
    description: 'Registra un usuario en Auth0 con metadata de edad y validaciones según política de privacidad'
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario registrado exitosamente',
    schema: {
      example: {
        success: true,
        message: 'Usuario registrado correctamente',
        userId: 'auth0|123456789',
        requiresParentalConsent: false
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Edad inválida o falta autorización parental' })
  async register(@Body() registerDto: RegisterDto) {
    try {
      const { nombre, email, edad, autorizacionParental, emailTutor } = registerDto;

      // Validación de edad según política de privacidad
      if (edad < 1 || edad > 120) {
        throw new HttpException('Edad inválida', HttpStatus.BAD_REQUEST);
      }

      // Menores de 14 años requieren autorización parental
      if (edad < 14) {
        if (!autorizacionParental || !emailTutor) {
          throw new HttpException(
            'Los menores de 14 años requieren autorización parental explícita y email del tutor',
            HttpStatus.BAD_REQUEST
          );
        }
      }

      console.log(`🔄 Registrando usuario: ${email}, edad: ${edad}`);

      // Registrar en Auth0 con metadata de edad
      const result = await this.auth0Service.registerUser({
        email,
        nombre,
        edad,
        autorizacionParental: edad < 14 ? autorizacionParental : undefined,
        emailTutor: edad < 14 ? emailTutor : undefined
      });

      return {
        success: true,
        message: edad < 14 
          ? 'Usuario menor registrado. Se requiere supervisión parental.'
          : 'Usuario registrado correctamente',
        userId: result.user_id,
        requiresParentalConsent: edad < 14,
        ageGroup: this.getAgeGroup(edad)
      };

    } catch (error: any) {
      console.error('❌ Error en registro:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        error.message || 'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('login')
  @ApiOperation({ 
    summary: 'Iniciar sesión con validación de edad',
    description: 'Autentica usuario y valida restricciones de edad'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso',
    schema: {
      example: {
        success: true,
        message: 'Login exitoso',
        token: 'jwt.token.here',
        user: {
          userId: 'auth0|123456789',
          email: 'usuario@ejemplo.com',
          ageGroup: 'teenager'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @ApiResponse({ status: 403, description: 'Usuario menor sin autorización parental' })
  async login(@Body() loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;

      // Autenticar con Auth0
      const authResult = await this.auth0Service.authenticateUser(email, password);
      
      // Obtener información del usuario incluyendo edad
      const userInfo = await this.auth0Service.getUserInfo(authResult.userId);
      
      // Validar edad para acceso
      const edad = userInfo.user_metadata?.edad;
      if (!edad) {
        throw new HttpException(
          'Usuario sin información de edad. Debe completar el registro.',
          HttpStatus.BAD_REQUEST
        );
      }

      // Verificar autorización parental para menores de 14
      if (edad < 14 && !userInfo.user_metadata?.autorizacionParental) {
        throw new HttpException(
          'Acceso denegado: menor de 14 años sin autorización parental',
          HttpStatus.FORBIDDEN
        );
      }

      console.log(`✅ Login exitoso para usuario edad: ${edad}`);

      return {
        success: true,
        message: 'Login exitoso',
        token: authResult.access_token,
        user: {
          userId: authResult.userId,
          email: userInfo.email,
          nombre: userInfo.name,
          edad: edad,
          ageGroup: this.getAgeGroup(edad),
          emailVerified: userInfo.email_verified
        }
      };

    } catch (error: any) {
      console.error('❌ Error en login:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Error de autenticación',
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  @Post('verify-age')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Verificar y actualizar edad del usuario',
    description: 'Permite actualizar la edad del usuario con las validaciones correspondientes'
  })
  @ApiBody({ type: AgeValidationDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Edad verificada y actualizada',
  })
  async verifyAge(@Request() req, @Body() ageDto: AgeValidationDto) {
    try {
      const userSub = req.user.sub;
      const { edad, autorizacionParental, emailTutor } = ageDto;

      // Validaciones
      if (edad < 1 || edad > 120) {
        throw new HttpException('Edad inválida', HttpStatus.BAD_REQUEST);
      }

      if (edad < 14 && (!autorizacionParental || !emailTutor)) {
        throw new HttpException(
          'Menores de 14 años requieren autorización parental y email del tutor',
          HttpStatus.BAD_REQUEST
        );
      }

      // Actualizar metadata en Auth0
      const updateData = {
        user_metadata: {
          edad,
          ageGroup: this.getAgeGroup(edad),
          autorizacionParental: edad < 14 ? autorizacionParental : undefined,
          emailTutor: edad < 14 ? emailTutor : undefined,
          ageVerifiedAt: new Date().toISOString()
        }
      };

      await this.auth0Service.updateUser(userSub, updateData);

      console.log(`✅ Edad verificada para usuario: ${userSub}, edad: ${edad}`);

      return {
        success: true,
        message: 'Edad verificada correctamente',
        ageGroup: this.getAgeGroup(edad),
        requiresSupervision: edad < 18
      };

    } catch (error: any) {
      console.error('❌ Error verificando edad:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('test-connection')
  @ApiOperation({ 
    summary: 'Probar conexión con Auth0',
    description: 'Verifica que la conexión con Auth0 esté funcionando correctamente'
  })
  async testAuth0Connection() {
    try {
      const isConnected = await this.auth0Service.testConnection();
      return {
        success: isConnected,
        message: isConnected ? 'Conexión con Auth0 exitosa' : 'Error de conexión con Auth0',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Error de conexión con Auth0',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Post('resend-verification')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Reenviar email de verificación',
    description: 'Reenvía el email de verificación al usuario autenticado'
  })
  @ApiBody({ type: ResendVerificationDto })
  async resendVerificationEmail(@Request() req, @Body() body: ResendVerificationDto) {
    try {
      const userSub = req.user.sub;
      const { userId } = body;

      console.log('🔄 Solicitud de reenvío de verificación para:', userSub);

      if (userId && userId !== userSub) {
        throw new HttpException(
          'No autorizado para realizar esta acción', 
          HttpStatus.FORBIDDEN
        );
      }

      const result = await this.auth0Service.resendVerificationEmail(userSub);
      
      return {
        success: result.success,
        message: result.message,
        ticket_url: result.ticket_url
      };
    } catch (error: any) {
      console.error('❌ Error reenviando email de verificación:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        error.message || 'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('check-verification')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Verificar estado del email',
    description: 'Comprueba si el email del usuario está verificado'
  })
  async checkEmailVerificationStatus(@Request() req) {
    try {
      const userSub = req.user.sub;
      console.log('🔍 Verificando estado de email para:', userSub);
      
      const userInfo = await this.auth0Service.getUserInfo(userSub);
      
      return {
        email_verified: userInfo.email_verified || false,
        email: userInfo.email,
        user_id: userInfo.user_id,
        edad: userInfo.user_metadata?.edad,
        ageGroup: userInfo.user_metadata?.ageGroup
      };
    } catch (error: any) {
      console.error('❌ Error verificando estado del email:', error);
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('user-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Obtener perfil de usuario',
    description: 'Obtiene la información completa del perfil del usuario autenticado'
  })
  async getUserProfile(@Request() req) {
    try {
      const userSub = req.user.sub;
      const userInfo = await this.auth0Service.getUserInfo(userSub);
      
      return {
        success: true,
        user: {
          ...userInfo,
          edad: userInfo.user_metadata?.edad,
          ageGroup: userInfo.user_metadata?.ageGroup,
          requiresSupervision: userInfo.user_metadata?.edad < 18
        }
      };
    } catch (error: any) {
      console.error('❌ Error obteniendo perfil:', error);
      throw new HttpException(
        'Error al obtener perfil de usuario',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('refresh-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Refrescar perfil de usuario',
    description: 'Obtiene la información actualizada del usuario desde Auth0'
  })
  async refreshUserProfile(@Request() req) {
    try {
      const userSub = req.user.sub;
      const userInfo = await this.auth0Service.getUserInfo(userSub);
      
      return {
        user: {
          email: userInfo.email,
          email_verified: userInfo.email_verified,
          name: userInfo.name,
          picture: userInfo.picture,
          user_id: userInfo.user_id,
          edad: userInfo.user_metadata?.edad,
          ageGroup: userInfo.user_metadata?.ageGroup,
          requiresSupervision: userInfo.user_metadata?.edad < 18
        }
      };
    } catch (error: any) {
      console.error('❌ Error refrescando perfil:', error);
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Método privado para determinar el grupo de edad
  private getAgeGroup(edad: number): string {
    if (edad < 14) return 'child';
    if (edad < 18) return 'teenager';
    return 'adult';
  }
}