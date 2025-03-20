import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteApp } from './notes.entity';

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
}),TypeOrmModule.forFeature([NoteApp])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
