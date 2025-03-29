import { Module } from "@nestjs/common";
import { SubscribeService } from "./subscribe.service";
import { SubscribeController } from "./subscribe.controller";
import { ModelmanagerModule } from "src/modelmanager/modelmanager.module";

@Module({
  imports: [ModelmanagerModule],
  controllers: [SubscribeController],
  providers: [SubscribeService],
})
export class SubscribeModule {}
