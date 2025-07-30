// backend/src/common/dto/juegos.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min, Max } from 'class-validator';

export class GuardarPuntajeDto {
  @ApiProperty({ 
    description: 'ID del juego',
    example: 1,
    minimum: 1
  })
  @IsNumber({}, { message: 'El ID del juego debe ser un número' })
  @IsPositive({ message: 'El ID del juego debe ser positivo' })
  juegoId!: number;

  @ApiProperty({ 
    description: 'Puntuación obtenida en el juego',
    example: 850,
    minimum: 0,
    maximum: 10000
  })
  @IsNumber({}, { message: 'La puntuación debe ser un número' })
  @Min(0, { message: 'La puntuación no puede ser negativa' })
  @Max(10000, { message: 'La puntuación no puede ser mayor a 10000' })
  puntuacion!: number;

  @ApiProperty({ 
    description: 'Tiempo transcurrido en segundos',
    example: 120,
    minimum: 1
  })
  @IsNumber({}, { message: 'El tiempo debe ser un número' })
  @IsPositive({ message: 'El tiempo debe ser positivo' })
  tiempo!: number;

  @ApiProperty({ 
    description: 'Número de intentos realizados',
    example: 5,
    minimum: 1
  })
  @IsNumber({}, { message: 'Los intentos deben ser un número' })
  @IsPositive({ message: 'Los intentos deben ser positivos' })
  intentos!: number;
}

export class JuegoDto {
  @ApiProperty({ 
    description: 'ID único del juego',
    example: 1 
  })
  id!: number;

  @ApiProperty({ 
    description: 'Nombre del juego',
    example: 'Memoria de Dinosaurios' 
  })
  nombre!: string;

  @ApiProperty({ 
    description: 'Descripción del juego',
    example: 'Encuentra las parejas de dinosaurios' 
  })
  descripcion!: string;

  @ApiProperty({ 
    description: 'Indica si el juego está disponible',
    example: true 
  })
  disponible!: boolean;
}

export class PuntajeDto {
  @ApiProperty({ 
    description: 'ID único del puntaje',
    example: 1 
  })
  id!: number;

  @ApiProperty({ 
    description: 'ID del juego',
    example: 1 
  })
  juegoId!: number;

  @ApiProperty({ 
    description: 'Nombre del juego',
    example: 'Memoria de Dinosaurios' 
  })
  nombreJuego!: string;

  @ApiProperty({ 
    description: 'Puntuación obtenida',
    example: 850 
  })
  puntuacion!: number;

  @ApiProperty({ 
    description: 'Fecha del puntaje',
    example: '2024-01-15T10:30:00.000Z' 
  })
  fecha!: Date;
}

export class EstadisticasDto {
  @ApiProperty({ 
    description: 'Total de juegos jugados',
    example: 15 
  })
  totalJuegos!: number;

  @ApiProperty({ 
    description: 'Puntuación promedio',
    example: 742 
  })
  puntuacionPromedio!: number;

  @ApiProperty({ 
    description: 'Mejor puntaje obtenido',
    example: 950 
  })
  mejorPuntaje!: number;

  @ApiProperty({ 
    description: 'Fecha del último juego',
    example: '2024-01-15T10:30:00.000Z',
    nullable: true 
  })
  ultimoJuego!: Date | null;
}