import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './create-reservation.dto';


@Controller()
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService){}

    //Create New Reservation - 新規予約
    @Post('reservations')
    create(@Body() createReservationDto: CreateReservationDto) {
        return this.reservationsService.createReservation(createReservationDto);
    }

    //Search for My Reservations - 自分の予約を一覧取得
    @Get('me/reservations')
    findMyReservations() {
        return this.reservationsService.findMyReservations();
    }

    //Cancel a specific reservations - 指定したIDの予約をキャンセル
    @Patch('reservations/:reservationId/cancel')
    cancel(
        @Param('reservationId', ParseIntPipe) reservationId: number){
            return this.reservationsService.cancelReservation(reservationId);
        }        
}
