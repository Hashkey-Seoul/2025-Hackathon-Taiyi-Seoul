import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { winstonLogger } from "./utils/winston.util";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );
  if (process.env.MODE !== "LIVE") {
    const config = new DocumentBuilder()
      .setTitle("Cookey API")
      .setDescription("")
      .setVersion("1.0")
      .addTag("Cookey")
      .addBearerAuth()
      .addApiKey()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);
  }
  app.enableCors({
    origin: "*", // 모든 도메인 허용 (보안상 특정 도메인만 허용 가능)
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  });

  await app.listen(3001);
}

bootstrap();
