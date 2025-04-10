import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LockNote, NoteApp } from './notes.entity';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { dataSource } from './auth.env';

@Module({

imports: [
TypeOrmModule.forRoot(dataSource),
TypeOrmModule.forFeature([LockNote,NoteApp]),
ConfigModule.forRoot({
  isGlobal:true,
  envFilePath: '.env',
}),
JwtModule.register({
  global: true,
  secret: process.env.SECRET,
  signOptions: { expiresIn: process.env.SIGN_OPTIONS },
}),
HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
