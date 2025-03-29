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
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guard/jwt.guard";
import { JwtPayloadDto } from "src/auth/dto/jwt-payload.dto";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/:wallet")
  getUserInfo(@Param("wallet") wallet) {
    return this.userService.getUserInfo(wallet);
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get("/me")
  // getMyInfo(@Req() req) {
  //   const jwtUser: JwtPayloadDto = req.user;
  //   return this.userService.getMyInfo(jwtUser);
  // }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get("/entries/me")
  // getMyEntries(@Req() req) {
  //   const jwtUser: JwtPayloadDto = req.user;
  //   return this.userService.getMyEntries(jwtUser);
  // }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get("/statics/me")
  // getMyStatics(@Req() req) {
  //   const jwtUser: JwtPayloadDto = req.user;
  //   return this.userService.getMyStatics(jwtUser);
  // }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Post("/upload")
  // uploadMyEntry(@Req() req, @Body() requestUploadDto: RequestUploadDto) {
  //   const jwtUser: JwtPayloadDto = req.user;
  //   return this.userService.uploadMyEntry(jwtUser, requestUploadDto);
  // }

  // @Get("/test")
  // test(@Req() req) {
  //   const jwtUser: JwtPayloadDto = req.user;
  //   return this.userService.test();
  // }
}
