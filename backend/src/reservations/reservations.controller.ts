import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './create-reservation.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';



@UseGuards(JwtAuthGuard)
@Controller()
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService){}

    // Create New Reservation - 新規予約
    @Post('reservations')
    create(@Req() req: RequestWithUser, @Body() createReservationDto: CreateReservationDto) {
        return this.reservationsService.createReservation(
            req.user.userId,
            createReservationDto,
        );
    }

    // Get My Reservations - 自分の予約を一覧取得
    @Get('me/reservations')
    findMyReservations(@Req() req: RequestWithUser) {
        return this.reservationsService.findMyReservations(req.user.userId);
    }

    // Get My detail Reservation - 予約詳細を取得
    @Get('reservations/:reservationId')
    findOne(
        @Req() req: RequestWithUser, @Param('reservationId', ParseIntPipe) reservationId: number
    ) {
        return this.reservationsService.findOne(req.user.userId, reservationId);
    }

    // Cancel a specific reservation - 指定したIDの予約をキャンセル
    @Patch('reservations/:reservationId/cancel')
    cancel(
        @Req() req: RequestWithUser,
        @Param('reservationId', ParseIntPipe) reservationId: number) {
            return this.reservationsService.cancelReservation(
                req.user.userId,
                reservationId
            );
        }        
}
