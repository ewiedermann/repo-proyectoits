// backend/src/users/users.service.ts - Versión limpia y completa
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Auth0Service } from 'src/auth/auth0.service';
import * as bcrypt from 'bcryptjs';

export interface UserProfile {
  auth0Id: string;
  email: string;
  nombre: string;
  edad: number;
  ageGroup: string;
  emailVerified: boolean;
  requiresSupervision: boolean;
  createdAt: string;
  localData?: any;
}

interface CreateLocalUserData {
  auth0Id: string;
  email: string;
  nombre: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth0Service: Auth0Service
  ) {}

  // ========== MÉTODOS NUEVOS PARA AUTH0 ==========

  // Obtener perfil completo del usuario (Auth0 + datos locales)
  async getUserProfile(auth0UserId: string): Promise<UserProfile> {
    try {
      // Obtener datos de Auth0
      const auth0User = await this.auth0Service.getUserInfo(auth0UserId);
      
      // Obtener datos locales si existen
      const localUser = await this.prisma.usuario.findUnique({
        where: { email: auth0User.email },
        include: {
          puntajes: {
            include: { juego: true },
            orderBy: { fecha: 'desc' },
            take: 10
          },
          desbloqueos: {
            include: { dinosaurio: true },
            orderBy: { fechaDesbloqueo: 'desc' }
          }
        }
      });

      const edad = auth0User.user_metadata?.edad || 0;
      
      return {
        auth0Id: auth0User.user_id,
        email: auth0User.email,
        nombre: auth0User.name || 'Usuario',
        edad,
        ageGroup: this.getAgeGroup(edad),
        emailVerified: auth0User.email_verified,
        requiresSupervision: edad < 18,
        createdAt: auth0User.created_at,
        localData: localUser ? {
          id: localUser.id,
          puntajes: localUser.puntajes,
          desbloqueos: localUser.desbloqueos,
          totalJuegos: localUser.puntajes.length,
          dinosauriosDesbloqueados: localUser.desbloqueos.length
        } : null
      };
    } catch (error: any) {
      console.error('Error obteniendo perfil de usuario:', error);
      throw new HttpException(
        'Error al obtener perfil de usuario',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Crear usuario local vinculado a Auth0 (solo para puntajes y desbloqueos)
  async createLocalUser(userData: CreateLocalUserData) {
    try {
      // Verificar si ya existe
      const existingUser = await this.prisma.usuario.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`Usuario local ya existe: ${userData.email}`);
        return existingUser;
      }

      // Crear nuevo usuario local
      const newUser = await this.prisma.usuario.create({
        data: {
          nombre: userData.nombre,
          email: userData.email,
          contraseña: 'AUTH0_USER' // Marcador para indicar que usa Auth0
        }
      });

      console.log(`✅ Usuario local creado: ${userData.email}`);
      return newUser;

    } catch (error: any) {
      console.error('Error creando usuario local:', error);
      throw new HttpException(
        'Error al crear usuario local',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Obtener o crear usuario local para puntajes
  async getOrCreateLocalUser(auth0UserId: string) {
    try {
      const auth0User = await this.auth0Service.getUserInfo(auth0UserId);
      
      let localUser = await this.prisma.usuario.findUnique({
        where: { email: auth0User.email }
      });

      if (!localUser) {
        localUser = await this.createLocalUser({
          auth0Id: auth0User.user_id,
          email: auth0User.email,
          nombre: auth0User.name || 'Usuario'
        });
      }

      return localUser;
    } catch (error: any) {
      console.error('Error obteniendo/creando usuario local:', error);
      throw new HttpException(
        'Error al obtener usuario local',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Actualizar información del usuario (solo en Auth0)
  async updateUserProfile(auth0UserId: string, updateData: any) {
    try {
      // Actualizar en Auth0
      const updatedAuth0User = await this.auth0Service.updateUser(auth0UserId, {
        name: updateData.nombre,
        user_metadata: {
          ...updateData.user_metadata
        }
      });

      // Si cambia el email, actualizar también en la BD local
      if (updateData.email) {
        const auth0User = await this.auth0Service.getUserInfo(auth0UserId);
        const localUser = await this.prisma.usuario.findUnique({
          where: { email: auth0User.email }
        });

        if (localUser) {
          await this.prisma.usuario.update({
            where: { id: localUser.id },
            data: {
              email: updateData.email,
              nombre: updateData.nombre || localUser.nombre
            }
          });
        }
      }

      return updatedAuth0User;
    } catch (error: any) {
      console.error('Error actualizando perfil:', error);
      throw new HttpException(
        'Error al actualizar perfil',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Agregar puntaje para usuario Auth0
  async addScore(auth0UserId: string, juegoId: number, puntuacion: number) {
    try {
      const localUser = await this.getOrCreateLocalUser(auth0UserId);
      
      const nuevoPuntaje = await this.prisma.puntaje.create({
        data: {
          usuarioId: localUser.id,
          juegoId,
          puntuacion
        },
        include: { juego: true }
      });

      console.log(`✅ Puntaje agregado: ${puntuacion} para usuario ${auth0UserId}`);
      return nuevoPuntaje;
    } catch (error: any) {
      console.error('Error agregando puntaje:', error);
      throw new HttpException(
        'Error al agregar puntaje',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Desbloquear dinosaurio para usuario Auth0
  async unlockDinosaur(auth0UserId: string, dinosaurioId: number) {
    try {
      const localUser = await this.getOrCreateLocalUser(auth0UserId);
      
      // Verificar si ya está desbloqueado
      const existingUnlock = await this.prisma.desbloqueo.findFirst({
        where: {
          usuarioId: localUser.id,
          dinosaurioId
        }
      });

      if (existingUnlock) {
        return existingUnlock;
      }

      const nuevoDesbloqueo = await this.prisma.desbloqueo.create({
        data: {
          usuarioId: localUser.id,
          dinosaurioId
        },
        include: { dinosaurio: true }
      });

      console.log(`🦕 Dinosaurio desbloqueado para usuario ${auth0UserId}`);
      return nuevoDesbloqueo;
    } catch (error: any) {
      console.error('Error desbloqueando dinosaurio:', error);
      throw new HttpException(
        'Error al desbloquear dinosaurio',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Obtener estadísticas del usuario
  async getUserStats(auth0UserId: string) {
    try {
      const localUser = await this.getOrCreateLocalUser(auth0UserId);
      const auth0User = await this.auth0Service.getUserInfo(auth0UserId);
      
      const stats = await this.prisma.usuario.findUnique({
        where: { id: localUser.id },
        include: {
          puntajes: {
            include: { juego: true }
          },
          desbloqueos: {
            include: { dinosaurio: true }
          }
        }
      });

      const totalPuntaje = stats?.puntajes.reduce((sum, p) => sum + p.puntuacion, 0) || 0;
      const promedioJuego = stats?.puntajes.length ? totalPuntaje / stats.puntajes.length : 0;
      const juegoFavorito = this.getMostPlayedGame(stats?.puntajes || []);

      return {
        totalJuegos: stats?.puntajes.length || 0,
        totalPuntaje,
        promedioPuntaje: Math.round(promedioJuego),
        dinosauriosDesbloqueados: stats?.desbloqueos.length || 0,
        juegoFavorito,
        edad: auth0User.user_metadata?.edad,
        ageGroup: this.getAgeGroup(auth0User.user_metadata?.edad || 0),
        fechaRegistro: auth0User.created_at,
        ultimaActividad: stats?.puntajes[0]?.fecha || auth0User.created_at
      };
    } catch (error: any) {
      console.error('Error obteniendo estadísticas:', error);
      throw new HttpException(
        'Error al obtener estadísticas',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Validar edad del usuario
  async validateUserAge(auth0UserId: string, requiredAge: number): Promise<boolean> {
    try {
      const auth0User = await this.auth0Service.getUserInfo(auth0UserId);
      const userAge = auth0User.user_metadata?.edad;
      
      if (!userAge) {
        throw new HttpException(
          'Usuario sin información de edad registrada',
          HttpStatus.BAD_REQUEST
        );
      }

      return userAge >= requiredAge;
    } catch (error: any) {
      console.error('Error validando edad:', error);
      throw new HttpException(
        'Error al validar edad del usuario',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Verificar si requiere supervisión parental
  async requiresParentalSupervision(auth0UserId: string): Promise<boolean> {
    try {
      const auth0User = await this.auth0Service.getUserInfo(auth0UserId);
      const userAge = auth0User.user_metadata?.edad;
      
      return userAge < 14;
    } catch (error: any) {
      console.error('Error verificando supervisión parental:', error);
      return true; // En caso de error, asumir que requiere supervisión
    }
  }

  // Eliminar datos de usuario menor sin autorización (cumplimiento GDPR)
  async deleteUnauthorizedMinorData(auth0UserId: string) {
    try {
      const auth0User = await this.auth0Service.getUserInfo(auth0UserId);
      const userAge = auth0User.user_metadata?.edad;
      const hasParentalConsent = auth0User.user_metadata?.autorizacionParental;

      // Solo eliminar si es menor de 14 y no tiene autorización
      if (userAge < 14 && !hasParentalConsent) {
        console.log(`🗑️ Eliminando datos de menor sin autorización: ${auth0UserId}`);
        
        // Eliminar datos locales
        const localUser = await this.prisma.usuario.findUnique({
          where: { email: auth0User.email }
        });

        if (localUser) {
          // Eliminar puntajes y desbloqueos
          await this.prisma.puntaje.deleteMany({
            where: { usuarioId: localUser.id }
          });
          
          await this.prisma.desbloqueo.deleteMany({
            where: { usuarioId: localUser.id }
          });
          
          // Eliminar usuario local
          await this.prisma.usuario.delete({
            where: { id: localUser.id }
          });
        }

        console.log(`✅ Datos eliminados para usuario menor sin autorización`);
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Error eliminando datos de menor:', error);
      throw new HttpException(
        'Error al eliminar datos de usuario menor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ========== MÉTODOS ORIGINALES MANTENIDOS ==========

  // Obtener un usuario por su ID (BD local)
  async getUserById(id: number) {
    try {
      return await this.prisma.usuario.findUnique({
        where: { id },
        include: {
          puntajes: {
            include: { juego: true }
          },
          desbloqueos: {
            include: { dinosaurio: true }
          }
        }
      });
    } catch (error: any) {
      console.error('Error obteniendo usuario por ID:', error);
      throw new HttpException(
        'Error al obtener usuario',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Actualizar usuario (BD local)
  async updateUser(id: number, data: { nombre: string; email: string }) {
    try {
      return await this.prisma.usuario.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      console.error('Error actualizando usuario:', error);
      throw new HttpException(
        'Error al actualizar usuario',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Obtener el ranking de un usuario (por Auth0 ID o ID local)
  async getUserRanking(auth0UserIdOrLocalId: string | number) {
    try {
      if (typeof auth0UserIdOrLocalId === 'string') {
        // Es Auth0 ID, obtener usuario local primero
        const localUser = await this.getOrCreateLocalUser(auth0UserIdOrLocalId);
        return await this.prisma.puntaje.findMany({
          where: { usuarioId: localUser.id },
          include: { juego: true },
          orderBy: { puntuacion: 'desc' }
        });
      } else {
        // Es ID local
        return await this.prisma.puntaje.findMany({
          where: { usuarioId: auth0UserIdOrLocalId },
          include: { juego: true },
          orderBy: { puntuacion: 'desc' }
        });
      }
    } catch (error: any) {
      console.error('Error obteniendo ranking:', error);
      throw new HttpException(
        'Error al obtener ranking',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Obtener todos los usuarios registrados (BD local)
  async getAllUsers() {
    try {
      const users = await this.prisma.usuario.findMany({
        include: {
          puntajes: {
            include: { juego: true }
          },
          desbloqueos: {
            include: { dinosaurio: true }
          }
        }
      });
      console.log('Usuarios obtenidos:', users.length);
      return users;
    } catch (error: any) {
      console.error('Error obteniendo todos los usuarios:', error);
      throw new HttpException(
        'Error al obtener usuarios',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Lógica de registro de un nuevo usuario (BD local - para compatibilidad)
  async register(name: string, email: string, password: string) {
    try {
      const existingUser = await this.prisma.usuario.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error('El correo electrónico ya está en uso');
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el nuevo usuario
      const newUser = await this.prisma.usuario.create({
        data: {
          nombre: name,
          email,
          contraseña: hashedPassword,
        },
      });

      return newUser;
    } catch (error: any) {
      console.error('Error en registro local:', error);
      throw new HttpException(
        error.message || 'Error al registrar usuario',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Lógica de inicio de sesión (BD local - para compatibilidad)
  async login(email: string, password: string) {
    try {
      // Buscar el usuario por su correo electrónico
      const user = await this.prisma.usuario.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Comparar las contraseñas
      const isPasswordValid = await bcrypt.compare(password, user.contraseña);
      if (!isPasswordValid) {
        throw new Error('Contraseña incorrecta');
      }

      return user;
    } catch (error: any) {
      console.error('Error en login local:', error);
      throw new HttpException(
        error.message || 'Error de autenticación',
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  // ========== MÉTODOS PRIVADOS DE UTILIDAD ==========

  private getAgeGroup(edad: number): string {
    if (edad < 14) return 'child';
    if (edad < 18) return 'teenager';
    return 'adult';
  }

  private getMostPlayedGame(puntajes: any[]): string {
    if (!puntajes.length) return 'Ninguno';
    
    const gameCount = puntajes.reduce((acc, puntaje) => {
      const gameName = puntaje.juego?.nombre || 'Desconocido';
      acc[gameName] = (acc[gameName] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(gameCount).reduce((a, b) => 
      gameCount[a] > gameCount[b] ? a : b
    );
  }
}