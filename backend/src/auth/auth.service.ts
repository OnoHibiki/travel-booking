import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; //Hash - ハッシュ
import { CreateUserDto } from './create-user.dto';
import { User } from 'src/common/interfaces/user.interface';
import { UsersService } from 'src/users/users.service';
    

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ){}

    // Create new User - 新規ユーザ登録　-----------------------------------------
    async register(createUserDto: CreateUserDto) {
        const { name, email, prefecture, password } = createUserDto;

        // Check if the email already exists　-　email重複チェック
        const existingUser = this.usersService.findByEmail(email);
        if(existingUser) {
            throw new ConflictException(
                'Email already registered. (このメールアドレスは既に登録されています)'
            );
        }

        // Hash the password before saving - passwordのハッシュ化
        const passwordHash = await bcrypt.hash(password, 10);

        // Create a new user - 新規ユーザの作成
        const newUser: User = {
            id: Date.now(), // Todo: Test -　仮
            name,
            email,
            prefecture,
            password_hash: passwordHash
        };

        this.usersService.createUser(newUser);

        return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            prefecture: newUser.prefecture,
            // Not return pass - パスワードハッシュは返さない
        };
    }

    // Login logic - ログイン機能　-------------------------------------------------
    async login(email: string, password: string) {
        const user = this.usersService.findByEmail(email);

        if(!user) {
            throw new UnauthorizedException(
                'Invalid credentials. (メールアドレスまたはパスワードが正しくありません)'
            );
        }
        
        // Compare the input password with the stored password hash - 入力されたパスワードと、登録されているパスワードのハッシュとで比較
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if(!isMatch) {
            throw new UnauthorizedException('Invalid credentials. (メールアドレスまたはパスワードが正しくありません)');
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
