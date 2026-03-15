import { Controller, Body, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { UpdateUserDto } from './update-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('me')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    // Get by self info - 自分の情報を取得
    @Get()
    findMe(@Req() req: RequestWithUser) {
        return this.usersService.findMe(req.user.userId); 
    }

    // Change by my info - 自分の情報を変更
    @Patch()
    updateMe(@Req() req: RequestWithUser, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.updateMe(req.user.userId, updateUserDto);
    }
}
