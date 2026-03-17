import { Injectable, NotFoundException } from '@nestjs/common';
import { HotelsService } from '../hotels/hotels.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomsService {
    constructor(
        private readonly hotelsService: HotelsService,
        private readonly prisma: PrismaService,
    ){}

    //Search for rooms by hotel ID　-　指定したホテルIDの全部屋を取得
    async findByHotelId(hotelId: number) {
        
        // Check whether the hotel exists - 指定したホテルIDのホテルが存在するか確認
        await this.hotelsService.findOne(hotelId);

        return this.prisma.room.findMany({
            where: { hotel_id: hotelId },
        });
    }

    // Find a room by ID - 指定したIDの部屋を取得
    async findOne(roomId: number){
        const room = await this.prisma.room.findUnique({
            where: { id: roomId },
        });

        if(!room) {
            throw new NotFoundException('Room not found. (対象の部屋が見つかりません)');
        }

        return room;
    }
}
