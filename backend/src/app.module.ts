<<<<<<< HEAD
// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JuegosModule } from './juegos/juegos.module';
=======
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config'; // Importa el módulo de configuración
import { AuthModule } from './auth/auth.module'; // Importa el módulo de autenticación
import { UsersModule } from './users/users.module'; 
import { MailModule } from './mail/mail.module';
/* import { DinosaursModule } from '../src/dinosaurs/dinosaurs.module';
import { RankingsModule } from './rankings/rankings.module';
import { JuegosModule } from './juegos/juegos.module'; */
>>>>>>> qa1

@Module({
  imports: [
    ConfigModule.forRoot({
<<<<<<< HEAD
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minuto
      limit: 10, // 10 requests por minuto
    }]),
    PrismaModule,
    AuthModule,
    JuegosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
=======
      isGlobal: true, // Hace que las variables de entorno estén disponibles globalmente
    }),
    PrismaModule, 
    AuthModule, 
    UsersModule,
    MailModule,
   /*  DinosaursModule,
    RankingsModule,
    JuegosModule, */
  ],
})
export class AppModule {}


/* 
¿Por qué es importante ConfigModule.forRoot()?
ConfigModule.forRoot() es necesario para cargar 
las variables de entorno desde tu archivo .env. Al
 pasar la opción { isGlobal: true }, las variables de 
 entorno estarán disponibles globalmente en toda la 
 aplicación,
 no solo en el módulo donde las defines. */ 
>>>>>>> qa1
