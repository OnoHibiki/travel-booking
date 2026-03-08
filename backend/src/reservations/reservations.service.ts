import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './create-reservation.dto';

@Injectable()
export class ReservationsService {
    createReservation(createReservationDto: CreateReservationDto) {
        return{//テストデータ
            id: 1,
            user_id: 1,
            room_id: createReservationDto.room_id,
            guest_count: createReservationDto.guest_count,
            check_in: createReservationDto.check_in,
            check_out: createReservationDto.check_out,
            total_price: 24000,
            status: 'CONFIREMED'
        };
    }
}
