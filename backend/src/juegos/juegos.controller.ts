// backend/src/juegos/juegos.controller.ts - Con decoradores de Swagger
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  UseGuards, 
  Request,
  HttpException,
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiBody,
  ApiProperty
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EmailVerifiedGuard } from '../auth/email-verified.guard';
import { JuegosService } from './juegos.service';

class GuardarPuntajeDto {
  @ApiProperty({ 
    description: 'ID del juego',
    example: 1 
  })
  juegoId: number | undefined;

  @ApiProperty({ 
    description: 'Puntuación obtenida',
    example: 850 
  })
  puntuacion: number | undefined;

  @ApiProperty({ 
    description: 'Tiempo en segundos',
    example: 120 
  })
  tiempo: number | undefined;

  @ApiProperty({ 
    description: 'Número de intentos',
    example: 5 
  })
  intentos: number | undefined;
}

class JuegoResponse {
  @ApiProperty({ example: 1 })
  id: number | undefined;

  @ApiProperty({ example: 'Memoria de Dinosaurios' })
  nombre: string | undefined;

  @ApiProperty({ example: 'Encuentra las parejas de dinosaurios' })
  descripcion: string | undefined;

  @ApiProperty({ example: true })
  disponible: boolean | undefined;
}

interface AuthenticatedRequest {
  user: {
    sub: string;
    [key: string]: any;
  };
  userInfo?: {
    email: string;
    email_verified: boolean;
    user_id: string;
    [key: string]: any;
  };
}

@ApiTags('juegos')
@Controller('juegos')
export class JuegosController {
  constructor(private readonly juegosService: JuegosService) {}

  @Get()
  @UseGuards(EmailVerifiedGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Obtener lista de juegos',
    description: 'Obtiene todos los juegos disponibles. Requiere email verificado.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de juegos disponibles',
    schema: {
      example: {
        success: true,
        message: 'Lista de juegos disponibles',
        user: {
          email: 'usuario@ejemplo.com',
          email_verified: true
        },
        juegos: [
          {
            id: 1,
            nombre: 'Memoria de Dinosaurios',
            descripcion: 'Encuentra las parejas de dinosaurios',
            disponible: true
          }
        ]
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token no válido' })
  @ApiResponse({ status: 403, description: 'Email no verificado' })
  async getJuegos(@Request() req: AuthenticatedRequest) {
    try {
      const userInfo = req.userInfo!;
      const juegos = await this.juegosService.getJuegosDisponibles();
      
      return {
        success: true,
        message: 'Lista de juegos disponibles',
        user: {
          email: userInfo.email,
          email_verified: userInfo.email_verified
        },
        juegos
      };
    } catch (error: any) {
      console.error('Error obteniendo juegos:', error);
      throw new HttpException(
        'Error al obtener lista de juegos',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('puntaje')
  @UseGuards(EmailVerifiedGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Guardar puntaje',
    description: 'Guarda el puntaje de una partida. Requiere email verificado.'
  })
  @ApiBody({ type: GuardarPuntajeDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Puntaje guardado correctamente',
    schema: {
      example: {
        success: true,
        message: 'Puntaje guardado correctamente',
        puntaje: {
          id: 1,
          puntuacion: 850,
          fecha: '2024-01-15T10:30:00.000Z',
          tiempo: 120,
          intentos: 5
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de puntaje incompletos' })
  @ApiResponse({ status: 401, description: 'Token no válido' })
  @ApiResponse({ status: 403, description: 'Email no verificado' })
  async guardarPuntaje(@Request() req: AuthenticatedRequest, @Body() puntajeData: GuardarPuntajeDto) {
    try {
      const userInfo = req.userInfo!;
      
      // Validar que todos los campos estén presentes
      if (!puntajeData.juegoId || !puntajeData.puntuacion || !puntajeData.tiempo || !puntajeData.intentos) {
        throw new BadRequestException('Datos de puntaje incompletos');
      }

      // Pasar los datos con tipos correctos al service
      const resultado = await this.juegosService.guardarPuntaje(userInfo.email, {
        juegoId: puntajeData.juegoId,
        puntuacion: puntajeData.puntuacion,
        tiempo: puntajeData.tiempo,
        intentos: puntajeData.intentos
      });
      
      return {
        success: resultado.success,
        message: 'Puntaje guardado correctamente',
        puntaje: resultado.puntaje
      };
    } catch (error: any) {
      console.error('Error guardando puntaje:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Error al guardar puntaje',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('mis-puntajes')
  @UseGuards(EmailVerifiedGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Obtener mis puntajes',
    description: 'Obtiene los últimos puntajes del usuario. Requiere email verificado.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de puntajes del usuario',
    schema: {
      example: {
        success: true,
        puntajes: [
          {
            id: 1,
            juegoId: 1,
            nombreJuego: 'Memoria de Dinosaurios',
            puntuacion: 850,
            fecha: '2024-01-15T10:30:00.000Z'
          }
        ]
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token no válido' })
  @ApiResponse({ status: 403, description: 'Email no verificado' })
  async getMisPuntajes(@Request() req: AuthenticatedRequest) {
    try {
      const userInfo = req.userInfo!;
      const puntajes = await this.juegosService.getPuntajesUsuario(userInfo.email);
      
      return {
        success: true,
        puntajes
      };
    } catch (error: any) {
      console.error('Error obteniendo puntajes:', error);
      throw new HttpException(
        'Error al obtener puntajes',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('estadisticas')
  @UseGuards(EmailVerifiedGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Obtener estadísticas',
    description: 'Obtiene estadísticas generales del usuario. Requiere email verificado.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estadísticas del usuario',
    schema: {
      example: {
        success: true,
        estadisticas: {
          totalJuegos: 15,
          puntuacionPromedio: 742,
          mejorPuntaje: 950,
          ultimoJuego: '2024-01-15T10:30:00.000Z'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token no válido' })
  @ApiResponse({ status: 403, description: 'Email no verificado' })
  async getEstadisticas(@Request() req: AuthenticatedRequest) {
    try {
      const userInfo = req.userInfo!;
      const puntajes = await this.juegosService.getPuntajesUsuario(userInfo.email);
      
      const totalJuegos = puntajes.length;
      const puntuacionPromedio = totalJuegos > 0 
        ? puntajes.reduce((sum, p) => sum + p.puntuacion, 0) / totalJuegos 
        : 0;
      const mejorPuntaje = totalJuegos > 0 
        ? Math.max(...puntajes.map(p => p.puntuacion)) 
        : 0;
      
      return {
        success: true,
        estadisticas: {
          totalJuegos,
          puntuacionPromedio: Math.round(puntuacionPromedio),
          mejorPuntaje,
          ultimoJuego: totalJuegos > 0 ? puntajes[0].fecha : null
        }
      };
    } catch (error: any) {
      console.error('Error obteniendo estadísticas:', error);
      throw new HttpException(
        'Error al obtener estadísticas',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}