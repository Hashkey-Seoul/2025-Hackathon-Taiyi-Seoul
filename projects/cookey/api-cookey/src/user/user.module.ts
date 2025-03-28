import { Logger, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { ModelmanagerModule } from "src/modelmanager/modelmanager.module";

@Module({
  imports: [ModelmanagerModule],
  controllers: [UserController],
  providers: [UserService, Logger],
})
export class UserModule {}
