import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsString, IsUrl } from "class-validator";
import { CoreResponseDto } from "src/common/dto/core.dto";

export class RequestUploadDto {
  @ApiProperty({
    description: "이미지 url",
    type: String,
  })
  @IsUrl()
  url: string;
}

export class RequestSignUpDto {
  @ApiProperty({
    description: "user wallet",
    type: String,
  })
  @IsEthereumAddress()
  wallet: string;
}
