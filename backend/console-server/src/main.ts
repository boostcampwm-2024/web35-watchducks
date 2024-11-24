import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn'],
    });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );
    app.setGlobalPrefix('api');
    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle('Watchducks API')
        .setDescription('초 훌륭한! 오직 성호님만을 위한! 그런! 완벽한! API 문서!')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    const port = process.env.PORT || 3000;
    const server = await app.listen(port);

    console.log(`Application is running on: ${await app.getUrl()}`);

    process.on('SIGTERM', () => {
        console.log('SIGTERM signal received: closing HTTP server');
        server.close(() => {
            console.log('HTTP server closed');
            process.exit(0);
        });
    });

    process.on('SIGINT', () => {
        console.log('SIGINT signal received: closing HTTP server');
        server.close(() => {
            console.log('HTTP server closed');
            process.exit(0);
        });
    });
}
bootstrap();
