import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { ConfigType } from "@nestjs/config";
import JwtConfig from "../../configs/jwt.config";
import { RedisCacheService } from "src/redis-cache/redis-cache.service";

@Injectable()
export class RefreshTokenstrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(
    private redisCacheService: RedisCacheService,
    @Inject(JwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof JwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: jwtConfig.REFRESH_KEY,
    });
  }
  async validate(payload: any, req: any) {
    const refreshToken = payload.headers.authorization.split(" ")[1];

    const cachedRefreshToken = await this.redisCacheService.get(
      `${req.userOid}:refreshToken:${refreshToken}`,
    );

    if (cachedRefreshToken === 1) {
      throw new UnauthorizedException("이미 로그아웃한 유저입니다.");
    }

    return req;
  }
}
