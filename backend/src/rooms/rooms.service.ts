import { Injectable } from '@nestjs/common';
import { HotelsService } from '../hotels/hotels.service';

@Injectable()
export class RoomsService {
    constructor(private readonly hotelsService: HotelsService){}

    //serch for Hotel's room
    findByHotelId(hotelId: number) {
        
        //Check the 404 !!
        this.hotelsService.findOne(hotelId);

        const data = {
            1: [
                { id: 1, name: 'Single Room', capacity: 1, price_day: 12000},
                { id: 2, name: 'Double Room', capacity: 2, price_day: 20000},
            ],
            2: [
                { id: 3, name: 'Standard Room', capacity: 2, price_day: 15000},
                { id: 4, name: 'Suite Room', capacity: 4, price_day: 40000},
            ],
            3: [] //Test
        };

        return data[hotelId] ?? [];
    }
}
