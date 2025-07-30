// backend/src/users/users.controller.ts - Fix final de tipos
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete,
  Body, 
  Param, 
  UseGuards, 
  Request,
  HttpException,
  HttpStatus,
  ParseIntPipe
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiProperty
} from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AgeValidationGuard, MinAge, RequiresSupervision } from '../auth/age-validation.guard';
import { UsersService, UserProfile } from './users.service'; // Importar la interfaz

export class UpdateProfileDto {
  @ApiProperty({ 
    description: 'Nuevo nombre del usuario',
    example: 'Juan Pérez Actualizado'
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty({ 
    description: 'Metadata adicional del usuario',
    required: false
  })
  @IsOptional()
  user_metadata?: any;
}

export class AddScoreDto {
  @ApiProperty({ 
    description: 'ID del juego',
    example: 1
  })
  @IsNumber()
  @Min(1)
  juegoId!: number;

  @ApiProperty({ 
    description: 'Puntuación obtenida',
    example: 1500
  })
  @IsNumber()
  @Min(0)
  puntuacion!: number;
}

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, AgeValidationGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ 
    summary: 'Obtener perfil completo del usuario',
    description: 'Obtiene información del usuario desde Auth0 y datos locales (puntajes, desbloqueos)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil del usuario obtenido exitosamente'
  })
  async getUserProfile(@Request() req: any): Promise<{ success: boolean; user: UserProfile }> {
    try {
      const userProfile = await this.usersService.getUserProfile(req.user.sub);
      return {
        success: true,
        user: userProfile
      };
    } catch (error: any) {
      console.error('Error obteniendo perfil:', error);
      throw new HttpException(
        'Error al obtener perfil de usuario',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('profile')
  @MinAge(13) // Solo usuarios de 13+ pueden actualizar su perfil
  @ApiOperation({ 
    summary: 'Actualizar perfil del usuario',
    description: 'Actualiza información del usuario (requiere 13+ años)'
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil actualizado exitosamente'
  })
  async updateProfile(@Request() req: any, @Body() updateData: UpdateProfileDto) {
    try {
      const updatedUser = await this.usersService.updateUserProfile(req.user.sub, updateData);
      
      console.log(`✅ Perfil actualizado para usuario: ${req.user.sub}`);
      
      return {
        success: true,
        message: 'Perfil actualizado correctamente',
        user: updatedUser
      };
    } catch (error: any) {
      console.error('Error actualizando perfil:', error);
      throw new HttpException(
        'Error al actualizar perfil',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('stats')
  @ApiOperation({ 
    summary: 'Obtener estadísticas del usuario',
    description: 'Obtiene estadísticas de juegos, puntajes y desbloqueos'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estadísticas obtenidas exitosamente'
  })
  async getUserStats(@Request() req: any) {
    try {
      const stats = await this.usersService.getUserStats(req.user.sub);
      return {
        success: true,
        stats
      };
    } catch (error: any) {
      console.error('Error obteniendo estadísticas:', error);
      throw new HttpException(
        'Error al obtener estadísticas',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('ranking')
  @ApiOperation({ 
    summary: 'Obtener ranking personal del usuario',
    description: 'Obtiene los puntajes del usuario ordenados por juego'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Ranking obtenido exitosamente'
  })
  async getUserRanking(@Request() req: any) {
    try {
      const ranking = await this.usersService.getUserRanking(req.user.sub);
      return {
        success: true,
        ranking
      };
    } catch (error: any) {
      console.error('Error obteniendo ranking:', error);
      throw new HttpException(
        'Error al obtener ranking',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('scores')
  @RequiresSupervision() // Registra acceso de menores
  @ApiOperation({ 
    summary: 'Agregar nuevo puntaje',
    description: 'Registra un nuevo puntaje del usuario en un juego'
  })
  @ApiBody({ type: AddScoreDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Puntaje agregado exitosamente'
  })
  async addScore(@Request() req: any, @Body() scoreData: AddScoreDto) {
    try {
      const { juegoId, puntuacion } = scoreData;
      
      // Validar datos
      if (!juegoId || puntuacion < 0) {
        throw new HttpException(
          'Datos de puntaje inválidos',
          HttpStatus.BAD_REQUEST
        );
      }

      const nuevoPuntaje = await this.usersService.addScore(
        req.user.sub, 
        juegoId, 
        puntuacion
      );

      // Log especial para menores
      if (req.ageGroup === 'child') {
        console.log(`🧒 Menor registrando puntaje: ${puntuacion} (supervisión requerida)`);
      }

      return {
        success: true,
        message: 'Puntaje registrado correctamente',
        puntaje: nuevoPuntaje
      };
    } catch (error: any) {
      console.error('Error agregando puntaje:', error);
      throw new HttpException(
        error.message || 'Error al agregar puntaje',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('unlock-dinosaur/:dinosaurioId')
  @RequiresSupervision() // Registra acceso de menores
  @ApiOperation({ 
    summary: 'Desbloquear dinosaurio',
    description: 'Desbloquea un dinosaurio para el usuario'
  })
  @ApiParam({ name: 'dinosaurioId', description: 'ID del dinosaurio a desbloquear' })
  @ApiResponse({ 
    status: 201, 
    description: 'Dinosaurio desbloqueado exitosamente'
  })
  async unlockDinosaur(
    @Request() req: any, 
    @Param('dinosaurioId', ParseIntPipe) dinosaurioId: number
  ) {
    try {
      const desbloqueo = await this.usersService.unlockDinosaur(
        req.user.sub, 
        dinosaurioId
      );

      // Log especial para menores
      if (req.ageGroup === 'child') {
        console.log(`🧒 Menor desbloqueando dinosaurio: ${dinosaurioId} (supervisión requerida)`);
      }

      return {
        success: true,
        message: '¡Dinosaurio desbloqueado!',
        desbloqueo
      };
    } catch (error: any) {
      console.error('Error desbloqueando dinosaurio:', error);
      throw new HttpException(
        'Error al desbloquear dinosaurio',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('age-validation')
  @ApiOperation({ 
    summary: 'Verificar restricciones de edad',
    description: 'Obtiene información sobre las restricciones de edad del usuario'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Información de edad obtenida'
  })
  async getAgeValidation(@Request() req: any) {
    try {
      const canAccess13Plus = await this.usersService.validateUserAge(req.user.sub, 13);
      const canAccess16Plus = await this.usersService.validateUserAge(req.user.sub, 16);
      const canAccess18Plus = await this.usersService.validateUserAge(req.user.sub, 18);
      const requiresSupervision = await this.usersService.requiresParentalSupervision(req.user.sub);

      const restrictions: string[] = [];
      if (!canAccess13Plus) restrictions.push('No puede modificar perfil');
      if (!canAccess16Plus) restrictions.push('No puede acceder a juegos avanzados');
      if (!canAccess18Plus) restrictions.push('No puede acceder a funciones de adultos');
      if (requiresSupervision) restrictions.push('Requiere supervisión parental activa');

      return {
        success: true,
        ageValidation: {
          edad: req.userAge,
          ageGroup: req.ageGroup,
          requiresSupervision,
          canAccessAdvancedFeatures: canAccess16Plus,
          canModifyProfile: canAccess13Plus,
          canAccessAdultFeatures: canAccess18Plus,
          restrictions: restrictions.length ? restrictions : ['Sin restricciones']
        }
      };
    } catch (error: any) {
      console.error('Error validando edad:', error);
      throw new HttpException(
        'Error al validar restricciones de edad',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('delete-minor-data')
  @MinAge(18) // Solo adultos pueden ejecutar eliminación de datos de menores
  @ApiOperation({ 
    summary: 'Eliminar datos de menor sin autorización',
    description: 'Elimina datos de usuarios menores de 14 años sin autorización parental (Solo administradores)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Datos eliminados si correspondía'
  })
  async deleteUnauthorizedMinorData(@Request() req: any) {
    try {
      // Esta función solo debería ser accesible por administradores
      // En una implementación real, verificarías roles/permisos adicionales
      
      const wasDeleted = await this.usersService.deleteUnauthorizedMinorData(req.user.sub);
      
      return {
        success: true,
        message: wasDeleted 
          ? 'Datos de menor sin autorización eliminados'
          : 'No se encontraron datos de menores sin autorización para eliminar',
        deleted: wasDeleted
      };
    } catch (error: any) {
      console.error('Error eliminando datos de menor:', error);
      throw new HttpException(
        'Error al eliminar datos de menor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('parental-status')
  @ApiOperation({ 
    summary: 'Verificar estado de supervisión parental',
    description: 'Verifica si el usuario requiere supervisión parental y su estado'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado de supervisión parental'
  })
  async getParentalStatus(@Request() req: any) {
    try {
      const requiresSupervision = await this.usersService.requiresParentalSupervision(req.user.sub);
      
      return {
        success: true,
        parentalStatus: {
          requiresSupervision,
          ageGroup: req.ageGroup,
          edad: req.userAge,
          message: requiresSupervision 
            ? 'Usuario menor de 14 años - Supervisión parental requerida'
            : 'Usuario no requiere supervisión parental'
        }
      };
    } catch (error: any) {
      console.error('Error verificando estado parental:', error);
      throw new HttpException(
        'Error al verificar estado de supervisión parental',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Métodos heredados del servicio original para compatibilidad
  @Get('by-id/:id')
  @ApiOperation({ 
    summary: 'Obtener usuario por ID local',
    description: 'Obtiene usuario de la base de datos local por ID (compatibilidad)'
  })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.usersService.getUserById(id);
      return {
        success: true,
        user
      };
    } catch (error: any) {
      console.error('Error obteniendo usuario por ID:', error);
      throw new HttpException(
        'Error al obtener usuario',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('all')
  @MinAge(18) // Solo adultos pueden ver todos los usuarios
  @ApiOperation({ 
    summary: 'Obtener todos los usuarios',
    description: 'Obtiene lista de todos los usuarios registrados (Solo administradores)'
  })
  async getAllUsers() {
    try {
      const users = await this.usersService.getAllUsers();
      return {
        success: true,
        users,
        total: users.length
      };
    } catch (error: any) {
      console.error('Error obteniendo todos los usuarios:', error);
      throw new HttpException(
        'Error al obtener usuarios',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}