import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { RoomsService } from '../rooms/rooms.service';

@Controller('hotels')
export class HotelsController {
    constructor(private readonly hotelsService: HotelsService,
                private readonly roomsService: RoomsService
    ) {}

    @Get()
    findAllHotels(@Query(`prefecture`) prefecture?: string) {
        //今はundefined許容
        return this.hotelsService.findAllHotels();
    }

    @Get(':hotelId')
    findOneHotel(@Param('hotelId', ParseIntPipe) hotelId: number) {
        return this.hotelsService.findOneHotel(hotelId); //超再帰的・・・というわけでなく、ここで読んでいるのはServiceのfindOne
    }

    // ------------------------------------

    @Get(':hotelId/rooms')
    findRoom(@Param('hotelId', ParseIntPipe) hotelId: number) {
        return this.roomsService.findRoom(hotelId);
    }

}
