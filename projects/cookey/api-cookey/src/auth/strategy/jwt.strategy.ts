import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService, ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { RedisCacheService } from "src/redis-cache/redis-cache.service";
import JwtConfig from "../../configs/jwt.config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private redisCacheService: RedisCacheService,
    @Inject(JwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof JwtConfig>,
  ) {
    // TODO: consider change SECRET_KEY to ACCESS_KEY
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.SECRET_KEY,
      passReqToCallback: true, // 아래 validate에서 payload 에 Req 값이, req에 paylod 값이 전달
    });
  }

  async validate(payload: any, req: any) {
    const accessToken = payload.headers.authorization.split(" ")[1];

    const cachedAccessToken = await this.redisCacheService.get(
      `${req.userOid}:accessToken:${accessToken}`,
    );

    if (cachedAccessToken === 1) {
      throw new UnauthorizedException("이미 로그아웃한 유저입니다.");
    }

    return req;
  }
}
