import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { JwtPayloadDto } from "src/auth/dto/jwt-payload.dto";
import { CodeStatus } from "src/enums/status-code.enum";
import { ModelType } from "src/enums/type.enum";
import { ModelmanagerService } from "src/modelmanager/modelmanager.service";

@Injectable()
export class UserService {
  constructor(
    private readonly modelManager: ModelmanagerService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}
}
