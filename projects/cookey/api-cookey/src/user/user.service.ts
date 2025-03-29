import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { JwtPayloadDto } from "src/auth/dto/jwt-payload.dto";
import { CodeStatus } from "src/enums/status-code.enum";
import { ModelType } from "src/enums/type.enum";
import { ModelmanagerService } from "src/modelmanager/modelmanager.service";
import { ResponseUserInfoDto, UserInfoDto } from "./dto/response-user.dto";

@Injectable()
export class UserService {
  constructor(
    private readonly modelManager: ModelmanagerService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  async getUserInfo(wallet) {
    const userModel = this.modelManager.getModel(ModelType.USER);
    const response = new ResponseUserInfoDto();
    try {
      const user = await userModel.findOne({ wallet: wallet });
      if (user) {
        response.data = new UserInfoDto();
        response.data.id = user._id;
        response.data.point = user.point;
        response.data.wallet = user.wallet;
      } else {
        response.code = -1;
        response.message = "No User";
      }
    } catch (error) {}
    return response;
  }
}
