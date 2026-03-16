import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { UpdateUserDto } from './update-user.dto';
import { User } from 'src/common/interfaces/user.interface';
import { CreateUserInput } from 'src/common/interfaces/create-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService){}

    // Build safe user response - password_hashを返さない形を共通化
    private toSafeUser(user: User) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            prefecture: user.prefecture,
        };
    }

    // Find user by ID - IDでユーザを検索
    async findById(userId: number) {
        const user = await this.prisma.user.findUnique({
            where : { id: userId },
        });
        
        if (!user) {
            throw new NotFoundException('User not found. (ユーザが見つかりません)');
        }

        return user;
    }

    // Find user by email - emailでユーザを検索
    async findByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where : { email },
        });

        return user;
    }    

    // Create a new user - 新しいユーザを作成
    async createUser(user: CreateUserInput) {
        return this.prisma.user.create({
            data: user,
        }); 
    }

    // Get by self info - 自分の情報を取得
    async findMe(userId: number) {
        const user = await this.prisma.user.findUnique({
            where : { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found. (ユーザーが見つかりません)');
        }

        return this.toSafeUser(user);
    }
    
    // Change by my info - 自分の情報を変更
    async updateMe(userId: number, updateUserDto: UpdateUserDto) {
        const user = await this.prisma.user.findUnique({
            where : { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found. (ユーザが見つかりません)');
        }
        
        if (updateUserDto.email) {
            const existingUser = await this.prisma.user.findUnique({
                where : { email: updateUserDto.email },
            });

            if (existingUser && existingUser.id !== userId ) {
                throw new ConflictException('This email already registered.(このメールアドレスはすでに登録されています)');
            }
        }

        if (
            updateUserDto.name === undefined &&
            updateUserDto.email === undefined &&
            updateUserDto.prefecture === undefined
        ) {
            throw new BadRequestException('No update fields provided.(更新項目が指定されていません)');
        }

        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(updateUserDto.name !== undefined && { name: updateUserDto.name }),
                ...(updateUserDto.email !== undefined && { email: updateUserDto.email }),
                ...(updateUserDto.prefecture !== undefined && { prefecture: updateUserDto.prefecture }),
            },
        });

        return this.toSafeUser(updatedUser);
    }

    // Update user password - ユーザのパスワードを更新
    async updatePassword(userId: number, password_hash: string) {
        const user = this.prisma.user.findUnique({
            where: { id: userId },
        })

        if(!user) {
            throw new NotFoundException('User not found. (ユーザが見つかりません)')
        }

        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: { password_hash },
        });

        return this.toSafeUser(updatedUser);
    }



}
