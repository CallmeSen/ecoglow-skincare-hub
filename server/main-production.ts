import { NestFactory } from '@nestjs/core';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('Creating NestJS application...');
  const app = await NestFactory.create(AppModule);
  console.log('NestJS application created successfully');
  
  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  console.log('Skipping ValidationPipe due to class-validator module resolution issue...');
  // Note: ValidationPipe disabled due to class-validator module resolution issues
  // Can be re-enabled once dependency issues are resolved

  console.log('Setting up Swagger documentation...');
  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('EcoGlow Skincare Hub API')
    .setDescription('Sustainable beauty and skincare e-commerce platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  console.log('Swagger documentation set up successfully');

  // Global prefix for all routes except root and admin routes
  app.setGlobalPrefix('api', {
    exclude: [
      '/',
      'admin', 
      'admin/*',
      { path: 'admin/components/*', method: RequestMethod.ALL },
      { path: 'admin/api/stats', method: RequestMethod.ALL }
    ]
  });

  // Start the Nest.js server
  console.log('Starting NestJS server...');
  const port = parseInt(process.env.PORT || '5000', 10);
  await app.listen(port, '0.0.0.0', () => {
    console.log(`NestJS server serving on port ${port}`);
  });
  console.log('NestJS server started successfully');
  console.log('Production server ready - Vite integration disabled');
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
