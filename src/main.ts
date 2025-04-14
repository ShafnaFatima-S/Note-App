import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cors = require('cors');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors({origin:'*'}))
  const appPort = process.env.NOTE_PORT ?? 8080
  await app.listen(appPort );
  console.log(`This service is running in the port 'http://localhost:${appPort}`)
}
bootstrap();
