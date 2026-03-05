import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { RoomsService } from '../rooms/rooms.service';

@Controller('hotels')
export class HotelsController {
    constructor(private readonly hotelsService: HotelsService,
                private readonly roomsService: RoomsService
    ) {}

    @Get()
    findAll(@Query('prefecture') prefecture?: string) {
        //今はundefined許容
        return this.hotelsService.findAll();
    }

    @Get(':hotelId')
    findOne(@Param('hotelId', ParseIntPipe) hotelId: number) {
        return this.hotelsService.findOne(hotelId); 
    }

    // ------------------------------------

    @Get(':hotelId/rooms')
    findRooms(@Param('hotelId', ParseIntPipe) hotelId: number) {
        return this.roomsService.findByHotelId(hotelId);
    }

}
