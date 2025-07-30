// backend/src/common/dto/common.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indica si la operación fue exitosa'
  })
  success!: boolean;

  @ApiProperty({
    example: 'Operación completada correctamente',
    description: 'Mensaje descriptivo del resultado'
  })
  message!: string;
}

export class ErrorResponseDto {
  @ApiProperty({
    example: 400,
    description: 'Código de estado HTTP'
  })
  statusCode!: number;

  @ApiProperty({
    example: 'Datos inválidos',
    description: 'Mensaje de error'
  })
  message!: string;

  @ApiProperty({
    example: 'Bad Request',
    description: 'Descripción del error'
  })
  error!: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Timestamp del error'
  })
  timestamp!: string;

  @ApiProperty({
    example: '/api/juegos/puntaje',
    description: 'Ruta donde ocurrió el error'
  })
  path!: string;
}
