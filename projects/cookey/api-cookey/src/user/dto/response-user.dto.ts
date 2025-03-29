import { ApiProperty } from "@nestjs/swagger";
import { CoreResponseDto } from "src/common/dto/core.dto";

export class UserInfoDto {
  id: string;
  wallet: string;
  point: number;
  credits: number;
}

export class ResponseUserInfoDto extends CoreResponseDto {
  data: UserInfoDto;
}
