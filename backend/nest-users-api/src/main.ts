// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:8080',
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
