import { ApiProperty } from "@nestjs/swagger";
import { IsUrl } from "class-validator";
import { CoreResponseDto } from "src/common/dto/core.dto";

export class RequestUploadDto {
  @ApiProperty({
    description: "이미지 url",
    type: String,
  })
  @IsUrl()
  url: string;
}
