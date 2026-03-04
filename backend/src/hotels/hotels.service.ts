import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class HotelsService {
    //Get all hotels
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

    //Get a specific hotel's details
    findOne(hotelId: number) {
        const hotel = this.findAll().find((h) => h.id === hotelId);
        
        //can't find hotel
        if(!hotel) {
            throw new NotFoundException('Hotel not found...');
        }

        return {
            ...hotel,
            description: hotelId === 1 ? 'Luxury hotel in Tokyo' : 'Comfortable stay in Osaka', // For testing only! lol
            cover_image_url: null,
            address_line: null,
        };
    }
}
