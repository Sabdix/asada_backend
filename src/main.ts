import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';
import { createServer } from 'http';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const server = createServer({
    maxHeaderSize: 1024 * 1024 * 16, // Ejemplo: 16MB para headers (Node.js default is 8KB)
  });
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Permite solicitudes desde este origen
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Permite el método PATCH
    allowedHeaders: 'Content-Type, Authorization', // Cabeceras permitidas
    credentials: true, // Permite el envío de credenciales (cookies, tokens, etc.)
  });
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ extended: true, limit: '200mb' }));
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ASADA API')
    .setDescription('API de ASADA')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(configService.get<number>('PORT') ?? 3000);
}
bootstrap();
