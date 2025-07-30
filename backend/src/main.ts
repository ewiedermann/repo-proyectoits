// backend/src/main.ts - Versión actualizada con Swagger
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.use(cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
  }));

  // Seguridad
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  }));

  // Validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Prefijo global para todas las rutas API
  app.setGlobalPrefix('api');

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Juegos Dinosaurios API')
    .setDescription('API backend para aplicación de juegos de dinosaurios con autenticación Auth0')
    .setVersion('1.0')
    .addTag('auth', 'Endpoints de autenticación y gestión de usuarios')
    .addTag('juegos', 'Endpoints de juegos y puntajes')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Token JWT de Auth0',
        in: 'header',
      },
      'JWT-auth'
    )
    .addServer('http://localhost:4000', 'Servidor de desarrollo')
    .setContact(
      'Equipo de Desarrollo',
      'https://tu-sitio.com',
      'contacto@tu-sitio.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Dinosaurios API Docs',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0 }
      .swagger-ui .info .title { color: #2c3e50 }
    `,
  });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 4000;

  await app.listen(port);
  
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📊 API endpoints available at http://localhost:${port}/api`);
  console.log(`🔐 Auth endpoints available at http://localhost:${port}/api/auth`);
  console.log(`📚 Swagger documentation at http://localhost:${port}/api/docs`);
}

bootstrap();