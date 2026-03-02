import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('WanderMatch backend')
  .setVersion('1.0')
  .addTag('wanderMatch-backend')
  .addBearerAuth()
  .build();
