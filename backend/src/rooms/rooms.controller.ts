import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Controller('hotels/:hotelId/rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {}

    @Get()
    findByhotel(@Param('hotelId', ParseIntPipe) hotelId: number) {
        return this.roomsService.findByHotelId(hotelId);
    }
}
