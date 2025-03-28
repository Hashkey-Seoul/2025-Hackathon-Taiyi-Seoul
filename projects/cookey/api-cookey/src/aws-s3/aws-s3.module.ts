import { forwardRef, Module, Logger } from "@nestjs/common";
import { AwsS3Service } from "./aws-s3.service";
import { AwsS3Controller } from "./aws-s3.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ModelmanagerModule } from "src/modelmanager/modelmanager.module";

@Module({
  imports: [MongooseModule.forFeature([]), ModelmanagerModule],
  controllers: [AwsS3Controller],
  providers: [AwsS3Service, Logger],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
