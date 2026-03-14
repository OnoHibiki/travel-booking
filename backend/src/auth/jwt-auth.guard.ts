import { AuthGuard } from "@nestjs/passport"; //　Gate Guard - 門番

export class JwtAuthGuard extends AuthGuard('jwt') {};// call Jwt-strategy - JWTストラテジーを呼び出す