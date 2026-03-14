import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
    private users = [
        {   //Test users - テストユーザー
            id: 1,
            name: 'hibiki',
            email: 'hibiki@test.com',
            prefecture: '大阪府',
        },
    ];

    findMe(userId: number) {
        const user = this.users.find((user) => user.id === userId);// only user Id - 今はIDだけ使う

        if(!user) {
            throw new NotFoundException('User not found. (ユーザーが見つかりません)');
        }

        return user;
    }

}
