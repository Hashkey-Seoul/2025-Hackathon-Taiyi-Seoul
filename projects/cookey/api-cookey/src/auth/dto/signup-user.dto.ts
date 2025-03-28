import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsEthereumAddress,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class SignDto {
  // @ApiProperty({
  //   description: 'solana 주소',
  //   type: String,
  // })
  // @IsString()
  // address: string;
  // @ApiProperty({
  //   description: '암호화 스트링',
  //   type: String,
  // })
  // @IsString()
  // signature: string;
  // @ApiProperty({
  //   description: '타임 스탬프',
  //   type: String,
  // })
  // @IsNumber()
  // timestamp: number;
  // ip;
  // agent;
}
