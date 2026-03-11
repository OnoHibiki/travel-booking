import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; //Hash - ハッシュ
import { CreateUserDto } from './create-user.dto';
    
type User = {
    id: number;
    name: string;
    email: string;
    prefecture?: string;
    password_hash: string;
};

@Injectable()
export class AuthService {
    private users: User[] = [];
    constructor(private readonly jwtService: JwtService){}

    // Create new User - 新規ユーザ登録　-----------------------------------------
    async register(createUserDto: CreateUserDto) {
        const { name, email, prefecture, password } = createUserDto;

        // Check if the email already exists　-　email重複チェック
        const existingUser = this.users.find((user) => user.email === email);
        if(existingUser) {
            throw new ConflictException(
                'Email already registered. (このメールアドレスは既に登録されています)'
            );
        }

        // Hash the password before saving - passwordのハッシュ化
        const passwordHash = await bcrypt.hash(password, 10);

        // Create the new user - 新規ユーザの作成
        const newUser: User = {
            id: this.users.length + 1,
            name,
            email,
            prefecture,
            password_hash: passwordHash
        };

        this.users.push(newUser);

        return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            prefecture: newUser.prefecture,
        };
    }

    // Login logic - ログイン機能　-------------------------------------------------
    async login(email: string, password: string) {
        const user = this.users.find((user) => user.email === email);

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
