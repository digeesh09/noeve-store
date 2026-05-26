import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const isProd = process.env.NODE_ENV === 'production';
  const forceHttps = process.env.FORCE_HTTPS === 'true' || isProd;

  if (forceHttps) {
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.set('trust proxy', 1);

    expressApp.use((req: Request, res: Response, next: NextFunction) => {
      const proto = req.headers['x-forwarded-proto'];
      if (proto === 'http') {
        const host = req.headers.host;
        return res.redirect(301, `https://${host}${req.url}`);
      }
      next();
    });
  }

  const defaultOrigins = ['http://localhost:3000', 'http://localhost:3002'];
  const corsOrigins = process.env.CORS_ORIGINS?.split(',').map((o) => o.trim()) ?? defaultOrigins;

  app.setGlobalPrefix('v1');
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.API_PORT ?? 3001;
  const publicUrl = process.env.API_URL ?? `http://localhost:${port}`;
  await app.listen(port);
  console.log(`Noeve API running at ${publicUrl}/v1`);
}

bootstrap();
