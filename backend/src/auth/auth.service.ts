import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; //Hash - ハッシュ
import { CreateUserDto } from './create-user.dto';
import { UsersService } from 'src/users/users.service';
    

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ){}

    // Create new User - 新規ユーザ登録
    async register(createUserDto: CreateUserDto) {
        const { name, email, prefecture, password } = createUserDto;

        // Check if the email already exists　-　email重複チェック
        const existingUser = await this.usersService.findByEmail(email);
        if(existingUser) {
            throw new ConflictException(
                'Email already registered. (このメールアドレスは既に登録されています)'
            );
        }

        // Hash the password before saving - passwordのハッシュ化
        const passwordHash = await bcrypt.hash(password, 10);

        // Create a new user - 新規ユーザの作成
        const newUser = await this.usersService.createUser({
            name,
            email,
            prefecture,
            password_hash: passwordHash
        });

        return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            prefecture: newUser.prefecture,
            // Not return pass - パスワードハッシュは返さない
        };
    }

    // Change current user password - パスワード変更
    async updatePassword(userId: number, currentPassword: string, newPassword: string) {
        const user = await this.usersService.findById(userId);
        
        // Compare current password with stored hash - 現在のパスワード確認
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);

        if(!isMatch){
            throw new UnauthorizedException(
                'Current password is incorrect. (現在のパスワードが正しくありません)'
            );
        }

        // Prevent using the same password - 同じパスワードは禁止
        if(currentPassword === newPassword) {
            throw new BadRequestException(
                'New password must be different. (新しいパスワードは現在のものと異なる必要があります)'
            );
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        return await this.usersService.updatePassword(userId, newPasswordHash); //users.service
        
    }

    // Login logic - ログイン機能　
    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException(
                'Invalid credentials. (メールアドレスまたはパスワードが正しくありません)'
            );
}
        
        // Compare the input password with the stored password hash - 入力されたパスワードと、登録されているパスワードのハッシュとで比較
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if(!isMatch) {
            throw new UnauthorizedException(
                'Invalid credentials. (メールアドレスまたはパスワードが正しくありません)'
            );
        }

        // Payload for JWT token - JWTトークンに含めるデータ
        const payload = {
            sub: user.id,
            email: user.email,
        };

        return {
            access_token: this.jwtService.sign(payload),
        };
        
    }

}
