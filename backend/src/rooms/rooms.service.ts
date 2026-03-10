import { Injectable, NotFoundException } from '@nestjs/common';
import { HotelsService } from '../hotels/hotels.service';

@Injectable()
export class RoomsService {
    constructor(private readonly hotelsService: HotelsService){}

    //Search for rooms by hotel ID　-　指定したホテルIDの全部屋を取得
    findByHotelId(hotelId: number) {
        
        // Check whether the hotel exists - 指定したホテルIDのホテルが存在するか確認
        this.hotelsService.findOne(hotelId);

        const data = {
            1: [
                { id: 1, name: 'Single Room', capacity: 1, price_per_night: 12000},
                { id: 2, name: 'Double Room', capacity: 2, price_per_night: 20000},
            ],
            2: [
                { id: 3, name: 'Standard Room', capacity: 2, price_per_night: 15000},
                { id: 4, name: 'Suite Room', capacity: 4, price_per_night: 40000},
            ],
            3: [] //Test
        };

        return data[hotelId] ?? [];
    }

    // Find a room by ID - 指定したIDの部屋を取得
    findOne(roomId: number){
        const rooms = [
            { id: 1, hotel_id: 1, name: 'Single Room', capacity: 1, price_per_night: 12000 },
            { id: 2, hotel_id: 1, name: 'Double Room', capacity: 2, price_per_night: 20000 },
            { id: 3, hotel_id: 2, name: 'Standard Room', capacity: 2, price_per_night: 15000 },
            { id: 4, hotel_id: 2, name: 'Suite Room', capacity: 4, price_per_night: 40000 },
        ];

        const room = rooms.find((room) => room.id === roomId);

        if(!room) {
            throw new NotFoundException('Room not found. (対象の部屋が見つかりません)');
        }

        return room;
    }
}
