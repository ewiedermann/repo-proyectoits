<<<<<<< HEAD
// backend/src/users/users.module.ts - Módulo actualizado con Auth0
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule, // Importar AuthModule para usar Auth0Service
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
=======
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [UsersController], 
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
>>>>>>> qa1
