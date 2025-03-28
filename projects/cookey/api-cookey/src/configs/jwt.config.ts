import { registerAs } from "@nestjs/config";
import { IsString } from "class-validator";

export class JwtConfig {
  @IsString()
  SECRET_KEY: string;

  @IsString()
  REFRESH_KEY: string;
}

export default registerAs("jwt", () => ({
  SECRET_KEY: process.env.SECRET_KEY,
  REFRESH_KEY: process.env.REFRESH_KEY,
}));
