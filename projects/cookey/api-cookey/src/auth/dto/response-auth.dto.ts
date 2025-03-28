import { ApiProperty } from "@nestjs/swagger";
import { CoreResponseDto } from "src/common/dto/core.dto";

export class SignInResponseDto extends CoreResponseDto {
  @ApiProperty({ description: "엑세스 토큰", type: String })
  accessToken: string;

  @ApiProperty({ description: "리프레시 토큰", type: String })
  refreshToken: string;
}

export class SignUpUserResponseDto extends SignInResponseDto {}

export class RefreshResponseDto extends CoreResponseDto {
  @ApiProperty({ description: "엑세스 토큰", type: String })
  accessToken: string;
}
