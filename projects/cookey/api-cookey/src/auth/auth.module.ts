import { DynamicModule, Module, Logger } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { RedisCacheModule } from "src/redis-cache/redis-cache.module";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { RefreshTokenstrategy } from "./strategy/jwt-refresh.strategy";
import { ModelmanagerModule } from "src/modelmanager/modelmanager.module";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";

@Module({})
export class AuthModule {
  static forRoot({ secret }: JwtModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        JwtModule.register({
          secret,
          signOptions: { expiresIn: "30d" },
        }),
        RedisCacheModule,
        PassportModule,
        ModelmanagerModule,
      ],
      providers: [AuthService, JwtStrategy, RefreshTokenstrategy, Logger],
      controllers: [AuthController],
      exports: [AuthService],
    };
  }
}
