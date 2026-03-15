import { Body, Controller, Post, UseGuards, Req, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './create-user.dto';
import { LoginDto } from './login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { UpdatePasswordDto } from './update-password.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('register')
    register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('password')
    updatePassword(
        @Req() req: RequestWithUser,
        @Body() dto: UpdatePasswordDto,
    ){
        return this.authService.updatePassword(
            req.user.userId,
            dto.currentPassword,
            dto.newPassword,
        );
    }

    @Post('login')
    login(@Body() { email, password }: LoginDto) {
        return this.authService.login(email, password);
    }
}
