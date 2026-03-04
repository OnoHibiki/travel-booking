import { Injectable } from '@nestjs/common';

@Injectable()
export class HotelsService {

    findAll() {
        return [
            {
                id: 1,
                name: "Tokyo Hotel",
                prefecture: "東京都",
                rating:5
            },
            {
                id: 2,
                name: "Osaka Hotel",
                prefecture: "大阪府",
                rating:4
            }
        ];
    }
}
