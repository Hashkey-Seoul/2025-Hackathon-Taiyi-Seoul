import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { LoggerMiddleware } from "./middlewares/logger.middleware";
import { Logger } from "@nestjs/common/services";
import { ModelmanagerModule } from "./modelmanager/modelmanager.module";
import { AwsS3Module } from "./aws-s3/aws-s3.module";
import { AuthModule } from "./auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "./user/user.module";
import { QuizModule } from "./quiz/quiz.module";
// import { SubscribeModule } from './subscribe/subscribe.module';
import jwtConfig from "./configs/jwt.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env.dev",
      isGlobal: true,
      load: [jwtConfig],
    }),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PW,
      dbName: process.env.MONGO_DBNAME,
    }),

    ModelmanagerModule,
    AwsS3Module,
    AuthModule.forRoot({
      secret: process.env.SECRET_KEY,
    }),
    UserModule,
    QuizModule,
    // SubscribeModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
