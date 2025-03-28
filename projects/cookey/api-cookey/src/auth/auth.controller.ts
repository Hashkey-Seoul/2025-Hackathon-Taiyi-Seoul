import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CoreResponseDto } from "src/common/dto/core.dto";
import { CodeStatus } from "src/enums/status-code.enum";
import { StatusMessage } from "src/enums/status-message.enum";
import { AuthService } from "./auth.service";
import { RefreshResponseDto, SignInResponseDto } from "./dto/response-auth.dto";
import { SignOutUserDto } from "./dto/signin-user.dto";
import { SignDto } from "./dto/signup-user.dto";
import { JwtRefreshGuard } from "./guard/jwt-refresh.guard";
import { JwtAuthGuard } from "./guard/jwt.guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @ApiOperation({
  //   summary: '서명 키 요청 API',
  //   description: '서명 키 요청',
  // })
  // @ApiResponse({
  //   status: CodeStatus.AUTH_WALLET_NOT_YET_SIGNED_UP,
  //   description: StatusMessage.AUTH_WALLET_NOT_YET_SIGNED_UP,
  //   type: RequesetMSGResponseDto,
  // })
  // @ApiCreatedResponse({
  //   description: '서명 키 를 생성하여 리턴',
  //   type: RequesetMSGResponseDto,
  // })
  // @Post('/reqmsg')
  // reqmsgUser(@Body() preSignInUserDto: PreSignInUserDto) {
  //   return this.authService.issueSignMessage(preSignInUserDto);
  // }

  // @ApiOperation({
  //   summary: '엑세스 토큰 요청 API',
  //   description: '엑세스 토큰 요청',
  // })
  // @ApiCreatedResponse({
  //   description: '갱신된 엑세스 토큰 전송',
  //   type: RefreshResponseDto,
  // })
  // @ApiBadRequestResponse({
  //   description: '오류가 발생 했을때,',
  //   type: CoreResponseDto,
  // })
  // @ApiBearerAuth()
  // @UseGuards(JwtRefreshGuard)
  // @Post('/refresh/accesstoken')
  // refreshAccessToken(@Req() req) {
  //   const jwtUser = req.user;
  //   return this.authService.refreshAccessTokens(jwtUser);
  // }

  // @ApiOperation({
  //   summary: 'QR 코드 유효여부 체크',
  //   description: 'QR 코드 유효성 검증을 위해서 호출',
  // })
  // @ApiCreatedResponse({
  //   description: '유효여부 결과 전송',
  //   type: MsgValidationResponseDto,
  // })
  // @ApiBadRequestResponse({
  //   description: '오류가 발생 했을때,',
  //   type: CoreResponseDto,
  // })
  // @Post('/signin/samsungtv/qrvalid')
  // checkValidation(@Body() samsungTvSignInReqDto: SamsungTvSignInReqDto) {
  //   return this.authService.checkValidation(samsungTvSignInReqDto.duid);
  // }
}
