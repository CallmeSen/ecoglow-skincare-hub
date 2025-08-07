import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { setupVite, serveStatic, log } from './vite';

async function bootstrap() {
  console.log('Creating NestJS application...');
  const app = await NestFactory.create(AppModule);
  console.log('NestJS application created successfully');
  
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

  // Global prefix for all routes except root
  app.setGlobalPrefix('api', {
    exclude: ['/']
  });

  // Get the underlying Express instance
  const expressApp = app.getHttpAdapter().getInstance();

  // Start the Nest.js server first
  console.log('Starting NestJS server...');
  const port = parseInt(process.env.PORT || '5000', 10);
  const server = await app.listen(port, '0.0.0.0', () => {
    log(`NestJS server serving on port ${port}`);
  });
  console.log('NestJS server started successfully');

  // Frontend route is now handled by FrontendController
  log('Frontend routes configured via FrontendController');

  // Server startup moved above Vite integration
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});