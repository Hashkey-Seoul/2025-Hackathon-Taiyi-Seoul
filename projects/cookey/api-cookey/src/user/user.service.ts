import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { JwtPayloadDto } from "src/auth/dto/jwt-payload.dto";
import { CodeStatus } from "src/enums/status-code.enum";
import { ModelType } from "src/enums/type.enum";
import { ModelmanagerService } from "src/modelmanager/modelmanager.service";
import { ResponseUserInfoDto, UserInfoDto } from "./dto/response-user.dto";
import { User } from "src/schemas/user.schema";
import { RequestSignUpDto } from "./dto/request-user.dto";

@Injectable()
export class UserService {
  constructor(
    private readonly modelManager: ModelmanagerService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  async signUpUser(body: RequestSignUpDto) {
    const userModel = this.modelManager.getModel(ModelType.USER);

    try {
      const user = await userModel.findOne({
        wallet: { $regex: new RegExp(`^${body.wallet}$`, "i") },
      });
      if (user == null) {
        const newUser = new User();
        newUser.wallet = body.wallet;
        newUser.point = 0;
        await userModel.create(newUser);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getUserInfo(wallet) {
    const userModel = this.modelManager.getModel(ModelType.USER);
    const response = new ResponseUserInfoDto();
    try {
      const user = await userModel.findOne({
        wallet: { $regex: new RegExp(`^${wallet}$`, "i") },
      });
      if (user) {
        response.data = new UserInfoDto();
        response.data.id = user._id;
        response.data.point = user.point;
        response.data.wallet = user.wallet;
      } else {
        const newUser = new User();
        newUser.wallet = wallet;
        newUser.point = 0;
        await userModel.create(newUser);

        response.data = new UserInfoDto();
        response.data.point = newUser.point;
        response.data.wallet = newUser.wallet;
      }
    } catch (error) {}
    return response;
  }
}
