// backend/src/common/dto/auth.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ResendVerificationDto {
  @ApiProperty({ 
    description: 'ID del usuario (opcional, se usa el del token si no se proporciona)',
    required: false,
    example: 'auth0|123456789'
  })
  @IsOptional()
  @IsString({ message: 'El ID del usuario debe ser una cadena' })
  userId?: string;
}

export class UserInfoDto {
  @ApiProperty({ 
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com' 
  })
  email!: string;

  @ApiProperty({ 
    description: 'Estado de verificación del email',
    example: true 
  })
  email_verified!: boolean;

  @ApiProperty({ 
    description: 'Nombre del usuario',
    example: 'Juan Pérez' 
  })
  name!: string;

  @ApiProperty({ 
    description: 'URL de la imagen de perfil',
    example: 'https://avatar.url' 
  })
  picture!: string;

  @ApiProperty({ 
    description: 'ID único del usuario en Auth0',
    example: 'auth0|123456789' 
  })
  user_id!: string;
}

export class ConnectionTestDto {
  @ApiProperty({ 
    description: 'Estado de la conexión',
    example: true 
  })
  success!: boolean;

  @ApiProperty({ 
    description: 'Mensaje descriptivo',
    example: 'Conexión con Auth0 exitosa' 
  })
  message!: string;

  @ApiProperty({ 
    description: 'Timestamp de la prueba',
    example: '2024-01-15T10:30:00.000Z' 
  })
  timestamp!: string;

  @ApiProperty({ 
    description: 'Mensaje de error si la conexión falla',
    required: false 
  })
  error?: string;
}