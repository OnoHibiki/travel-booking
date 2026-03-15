import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { UpdateUserDto } from './update-user.dto';
import { User } from 'src/common/interfaces/user.interface';

@Injectable()
export class UsersService {
    private users : User[] = [];

    // Find user by email - emailでユーザを検索
    findByEmail(email: string) {
        return this.users.find((user) => user.email === email);
    }

    // Create a new user - 新しいユーザを作成
    createUser(user: User) {
        this.users.push(user);
        return user; 
    }

    // Get by self info - 自分の情報を取得
    findMe(userId: number) {
        const user = this.users.find((user) => user.id === userId);// only user Id - 今はIDだけ使う

        if(!user) {
            throw new NotFoundException('User not found. (ユーザーが見つかりません)');
        }

        return { // Not return pass - パスワードハッシュは返さない
            id: user.id,
            name: user.name,
            email: user.email,
            prefecture: user.prefecture,
        };
    }
    
    // Change by my info - 自分の情報を変更
    updateMe(userId: number, updateUserDto: UpdateUserDto) {
        const user = this.users.find((user) => user.id === userId);

        if(!user) {
            throw new NotFoundException('User not found. (ユーザが見つかりません)');
        }
        
        if(updateUserDto.email) {
            const existingUser = this.users.find((u) => u.email === updateUserDto.email && u.id !== userId);

            if(existingUser) {
                throw new ConflictException('This email already registered.(このメールアドレスはすでに登録されています)');
            }
        }

        if(
            updateUserDto.name === undefined &&
            updateUserDto.email === undefined &&
            updateUserDto.prefecture === undefined
        ) {
            throw new BadRequestException('No update fields provided.(更新項目が指定されていません)');
        }

        if(updateUserDto.name !== undefined) {
            user.name = updateUserDto.name;
        }
        
        if(updateUserDto.email !== undefined) {
            user.email = updateUserDto.email;
        }

        if(updateUserDto.prefecture !== undefined) {
            user.prefecture = updateUserDto.prefecture;
        }

        return { // Not return pass - パスワードハッシュは返さない
            id: user.id,
            name: user.name,
            email: user.email,
            prefecture: user.prefecture,
        };
    }



}
