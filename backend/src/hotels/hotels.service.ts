import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HotelsService {
    constructor(private readonly prisma: PrismaService){}
    // Get all hotels　-　ホテル一覧検索
    async findAll(){
        return this.prisma.hotel.findMany();
    }

    // Get a specific hotel's details　-　あるホテルの詳細を取得
    async findOne(hotelId: number) {
        const hotel = await this.prisma.hotel.findUnique({
            where: { id: hotelId },
        });
        
        // Can't find hotel - 対象のホテルが見つからない
        if(!hotel) {
            throw new NotFoundException('Hotel not found...');
        }

        return hotel;
    }
}
