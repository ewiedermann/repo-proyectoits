// backend/src/auth/auth0.service.ts - Actualizado con funciones de registro
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface RegisterUserData {
  email: string;
  nombre: string;
  edad: number;
  autorizacionParental?: boolean;
  emailTutor?: string;
}

@Injectable()
export class Auth0Service {
  private domain: string;
  private clientId: string;
  private clientSecret: string;
  private managementToken = '';
  private tokenExpiry: number = 0;

  constructor(private configService: ConfigService) {
    this.domain = this.getEnvOrThrow('AUTH0_DOMAIN');
    this.clientId = this.getEnvOrThrow('AUTH0_CLIENT_ID');
    this.clientSecret = this.getEnvOrThrow('AUTH0_CLIENT_SECRET');

    console.log('✅ Auth0Service inicializado correctamente');
    console.log('Domain:', this.domain);
    console.log('Client ID:', this.clientId);
  }

  private getEnvOrThrow(key: string): string {
    const value = this.configService.get<string>(key);
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`Missing or invalid environment variable: ${key}`);
    }
    return value;
  }

  // Nuevo método para registrar usuario con Auth0 Management API
  async registerUser(userData: RegisterUserData) {
    try {
      const token = await this.getManagementToken();
      const { email, nombre, edad, autorizacionParental, emailTutor } = userData;

      // Generar contraseña temporal (el usuario la cambiará en primer login)
      const tempPassword = this.generateTempPassword();

      const newUser = {
        email,
        password: tempPassword,
        name: nombre,
        connection: 'Username-Password-Authentication', // Conexión por defecto
        user_metadata: {
          edad,
          ageGroup: this.getAgeGroup(edad),
          autorizacionParental: edad < 14 ? autorizacionParental : undefined,
          emailTutor: edad < 14 ? emailTutor : undefined,
          registeredAt: new Date().toISOString(),
          requiresSupervision: edad < 18
        },
        app_metadata: {
          registrationMethod: 'dinosdev_app',
          parentalConsent: edad < 14 ? autorizacionParental : true
        }
      };

      console.log(`🔄 Creando usuario en Auth0: ${email}`);

      const response = await axios.post(
        `https://${this.domain}/api/v2/users`,
        newUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Enviar email de verificación
      try {
        await this.sendVerificationEmail(response.data.user_id);
      } catch (emailError) {
        console.warn('⚠️ No se pudo enviar email de verificación:', emailError);
      }

      console.log(`✅ Usuario creado exitosamente: ${response.data.user_id}`);

      return {
        user_id: response.data.user_id,
        email: response.data.email,
        email_verified: response.data.email_verified,
        created_at: response.data.created_at
      };

    } catch (error: any) {
      console.error('❌ Error creando usuario:', error.response?.data || error.message);
      
      if (error.response?.status === 409) {
        throw new HttpException('El email ya está registrado', HttpStatus.CONFLICT);
      }
      
      if (error.response?.status === 400) {
        throw new HttpException(
          `Error en datos de registro: ${error.response.data?.message}`, 
          HttpStatus.BAD_REQUEST
        );
      }
      
      throw new HttpException('Error creando usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Nuevo método para autenticar usuario (para login)
  async authenticateUser(email: string, password: string) {
    try {
      const response = await axios.post(
        `https://${this.domain}/oauth/token`,
        {
          grant_type: 'password',
          username: email,
          password: password,
          audience: `https://${this.domain}/api/v2/`,
          scope: 'openid profile email',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      return {
        access_token: response.data.access_token,
        token_type: response.data.token_type,
        userId: response.data.sub || email // Fallback al email si no hay sub
      };

    } catch (error: any) {
      console.error('❌ Error autenticando usuario:', error.response?.data || error.message);
      
      if (error.response?.status === 403 || error.response?.status === 401) {
        throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
      }
      
      throw new HttpException('Error de autenticación', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserInfo(userId: string) {
    try {
      const token = await this.getManagementToken();
      const response = await axios.get(
        `https://${this.domain}/api/v2/users/${encodeURIComponent(userId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const user = response.data;
      return {
        email: user.email || '',
        email_verified: Boolean(user.email_verified),
        name: user.name || '',
        picture: user.picture || '',
        user_id: user.user_id || '',
        created_at: user.created_at || '',
        updated_at: user.updated_at || '',
        user_metadata: user.user_metadata || {},
        app_metadata: user.app_metadata || {}
      };
    } catch (error: any) {
      console.error('Error obteniendo usuario de Auth0:', error.response?.data || error.message);
      if (error.response?.status === 404) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      if (error.response?.status === 401) {
        throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException('Error interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Método mejorado para enviar email de verificación
  private async sendVerificationEmail(userId: string) {
    try {
      const token = await this.getManagementToken();
      const frontendUrl = this.getEnvOrThrow('FRONTEND_URL');

      const ticketData = {
        user_id: userId,
        result_url: `${frontendUrl}/juegos`,
        ttl_sec: 432000, // 5 días
      };

      const response = await axios.post(
        `https://${this.domain}/api/v2/tickets/email-verification`,
        ticketData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error enviando email de verificación:', error.response?.data || error.message);
      throw error;
    }
  }

  async resendVerificationEmail(userId: string) {
    try {
      const user = await this.getUserInfo(userId);

      if (user.email_verified) {
        throw new HttpException('El email ya está verificado', HttpStatus.BAD_REQUEST);
      }

      const token = await this.getManagementToken();
      const frontendUrl = this.getEnvOrThrow('FRONTEND_URL');

      const ticketData = {
        user_id: userId,
        result_url: `${frontendUrl}/juegos`,
        ttl_sec: 432000,
      };

      const response = await axios.post(
        `https://${this.domain}/api/v2/tickets/email-verification`,
        ticketData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        message: 'Email enviado correctamente',
        ticket_url: response.data.ticket || '',
      };
    } catch (error: any) {
      console.error('Error reenviando email:', error.response?.data || error.message);
      if (error instanceof HttpException) throw error;

      if (error.response?.status === 400) {
        throw new HttpException(`Datos inválidos: ${error.response.data?.message}`, HttpStatus.BAD_REQUEST);
      }

      if (error.response?.status === 403) {
        throw new HttpException('Permisos insuficientes', HttpStatus.FORBIDDEN);
      }

      throw new HttpException('Error interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUser(userId: string, updateData: any) {
    try {
      const token = await this.getManagementToken();

      const response = await axios.patch(
        `https://${this.domain}/api/v2/users/${encodeURIComponent(userId)}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error actualizando usuario:', error.response?.data || error.message);
      throw new HttpException('Error al actualizar usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getManagementToken(): Promise<string> {
    if (this.managementToken && Date.now() < this.tokenExpiry) {
        return this.managementToken;
    }

    try {
      const response = await axios.post(
        `https://${this.domain}/oauth/token`,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          audience: `https://${this.domain}/api/v2/`,
          grant_type: 'client_credentials',
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      this.managementToken = response.data.access_token;
      this.tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // 23h
      return this.managementToken;
    } catch (error: any) {
      console.error('Error obteniendo token:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException('Error de autenticación', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getManagementToken();
      return true;
    } catch (error: any) {
      console.error('Error de conexión:', error.message);
      return false;
    }
  }

  // Método privado para generar contraseña temporal
  private generateTempPassword(): string {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
  }

  // Método privado para determinar grupo de edad
  private getAgeGroup(edad: number): string {
    if (edad < 14) return 'child';
    if (edad < 18) return 'teenager';
    return 'adult';
  }
}