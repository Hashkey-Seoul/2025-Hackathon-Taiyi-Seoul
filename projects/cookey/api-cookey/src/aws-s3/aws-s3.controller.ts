import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CodeStatus } from "src/enums/status-code.enum";
import { StatusMessage } from "src/enums/status-message.enum";
import { AwsS3Service } from "./aws-s3.service";

import {
  ResponsePreSignedPostUrlDto,
  ResponseUrlDto,
} from "./dto/response-url.dto";
import { JwtAuthGuard } from "src/auth/guard/jwt.guard";

@ApiTags("AWS")
@Controller("aws-s3")
export class AwsS3Controller {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  @ApiOperation({
    summary: "presigned upload url 요청",
    description: "리소스 데이터를 업로드할 s3 url 요청",
  })
  @ApiResponse({
    status: CodeStatus.AWS_INVALID_UPLOAD_MODE,
    description: StatusMessage.AWS_INVALID_UPLOAD_MODE,
  })
  @ApiResponse({
    status: CodeStatus.AWS_INVALID_RESOURCE_TYPE,
    description: StatusMessage.AWS_INVALID_RESOURCE_TYPE,
  })
  @ApiResponse({
    status: CodeStatus.AWS_NO_TARGET_ID,
    description: StatusMessage.AWS_NO_TARGET_ID,
  })
  @ApiCreatedResponse({
    description: "presigned upload url 를 생성하여 리턴",
    type: ResponseUrlDto,
  })
  @ApiQuery({
    name: "mode",
    description:
      "업로드 방식을 새 파일로 할지, 기존 파일을 덮어쓰는 모드로 할지 결정\n\n * **create** = uuid 새로 발급해서 s3 key 발급\n\n * **modify** = 업로드된 s3에 있는 기존 key로 발급",
    type: "create | modify",
    example: "/request-upload-url?mode=create | modify",
    required: false,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/upload")
  getPreSignedURL(@Req() req, @Query() quries) {
    const jwtUser = req.user;
    return this.awsS3Service.getSignedURLByQuries(jwtUser, quries);
  }
}
