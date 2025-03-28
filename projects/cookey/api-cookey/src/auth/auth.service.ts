import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import JwtConfig from "src/configs/jwt.config";
import { RedisCacheService } from "src/redis-cache/redis-cache.service";
import { SignDto } from "./dto/signup-user.dto";
import { JwtPayloadDto } from "./dto/jwt-payload.dto";
import { CoreResponseDto } from "src/common/dto/core.dto";
import { SignInResponseDto } from "./dto/response-auth.dto";
import { StatusMessage } from "src/enums/status-message.enum";
import { CodeStatus } from "src/enums/status-code.enum";
import { ModelmanagerService } from "src/modelmanager/modelmanager.service";

import { ModelType } from "src/enums/type.enum";
import { timestamp } from "rxjs";
import { User } from "src/schemas/user.schema";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisCacheService: RedisCacheService,
    private readonly modelService: ModelmanagerService,
    @Inject(JwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof JwtConfig>,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}
}
