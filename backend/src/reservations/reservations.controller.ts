import { Body, Controller, Post } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './create-reservation.dto';


@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService){}

    @Post()
    create(@Body() createReservationDto: CreateReservationDto) {
        return this.reservationsService.createReservation(createReservationDto);
    }
}
