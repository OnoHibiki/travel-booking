import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@Controller('me')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @UseGuards(JwtAuthGuard) //　user Gate Guard - トークン所持確認
    @Get()
    getMe(@Req() req: RequestWithUser) {
        return this.usersService.findMe(req.user.userId); // only user Id - 今はIDだけ使う
    }
}
