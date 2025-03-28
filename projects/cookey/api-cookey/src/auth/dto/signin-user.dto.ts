import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsEthereumAddress,
  IsJWT,
  IsMongoId,
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { Schema as MongooseSchema } from "mongoose";

export class SignInUserDto {
  @ApiProperty({
    description: "지갑 주소",
    type: "ETH ADDR String",
  })
  @IsNotEmpty()
  @IsEthereumAddress()
  walletAddr: string;

  @ApiProperty({
    description: "서명된 값",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  signature: string;

  ip;
  agent;
}

export class SignOutUserDto {
  @ApiProperty({
    description: "리프레시 토큰",
    type: "JWT String",
  })
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}

export class SamsungTvSignInReqDto {
  @ApiProperty({
    description: "TV UUID",
    type: "UUID String",
  })
  @IsNotEmpty()
  @IsUUID()
  duid: string; //삼성 TV Device uuid
}

export class SamsungTvSignInDto {
  @ApiProperty({
    description: "TV UUID",
    type: "UUID String",
  })
  @IsNotEmpty()
  @IsUUID()
  duid: string; //삼성 TV Device uuid

  @ApiProperty({
    description: "서명된 값",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  signature: string; //서명된 지갑주소

  @ApiProperty({
    description: "지갑 주소",
    type: "ETH ADDR String",
  })
  @IsNotEmpty()
  @IsEthereumAddress()
  walletAddr: string; //지갑주소

  @ApiProperty({
    description: "인증번호 6자리",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  verificationCode: string; //인증번호 6자리
}

export class SamsungTvSignInConfirmDto {
  @ApiProperty({
    description: "TV UUID",
    type: "UUID String",
  })
  @IsNotEmpty()
  @IsUUID()
  duid: string; //삼성 TV Device uuid
}

export class EmailVerificationRequestDto {
  @ApiProperty({
    example: "jade@arttoken.ai",
    description: "email address",
    type: String,
  })
  @IsEmail()
  email;

  // @ApiProperty({
  //   example: '0xcaae1e948723B85363A1d56a76AACa4855a0cEE3',
  //   description: '사용자 지갑 주소',
  //   required: true,
  //   type: 'ETH Addr String',
  // })
  // @IsEthereumAddress()
  // wallet;

  // @ApiProperty({
  //   description: '사용자 ID로 사용할 닉네임',
  //   type: String,
  //   example: 'Jade',
  // })
  // @IsString()
  // @MinLength(4)
  // @MaxLength(14)
  // @Matches(/^[a-zA-Z0-9_]*$/)
  // readonly nickname: string;
}

export class VerifyEmailDto {
  @ApiProperty({
    example: "62e8eef54b0598a62819330f",
    description: "MongoDB Object ID",
    required: true,
    type: MongooseSchema.Types.ObjectId,
  })
  @IsMongoId()
  mid;

  @ApiProperty({
    description: "인증코드",
    type: String,
    example: "005463",
  })
  @IsNumberString()
  verificationCode;
}
