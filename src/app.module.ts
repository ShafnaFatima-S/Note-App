import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteApp } from './notes.entity';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'shaf123',
    database: 'postgres',
    synchronize: true,
    entities: [NoteApp],
}),
JwtModule.register({
  global: true,
  secret: process.env.SECRET,
  signOptions: { expiresIn: process.env.SIGN_OPTIONS },
}),
TypeOrmModule.forFeature([NoteApp]),
HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
