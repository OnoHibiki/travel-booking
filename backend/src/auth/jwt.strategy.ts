import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, // Check expiration - トークン有効期限の確認
            secretOrKey: process.env.JWT_SECRET!, //Env variable - 環境変数から秘密鍵を取得
        });
    }

    // Identify user - 認証成功後のユーザ特定
    async validate(payload: { sub: number; email: string }) {
        return{
            userId: payload.sub,
            email: payload.email,
        };
    }
}