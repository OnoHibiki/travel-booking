import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateReservationDto } from './create-reservation.dto';

@Injectable()
export class ReservationsService {
    createReservation(createReservationDto: CreateReservationDto) {

        const { room_id, guest_count, check_in, check_out} = createReservationDto;
        
        // Check minimum guest count - 最小宿泊人数のチェック

        if (guest_count < 1) {
            throw new BadRequestException(`Guest count must be at least 1. (宿泊人数は１以上で指定してください)`)
        }


        //Validate that check-in date is before check-out date　-　チェックイン日がチェックアウト日より前であるかのチェック
        const checkInDate = new Date(check_in);
        const checkOutDate = new Date(check_out);
        if(checkInDate >= checkOutDate) {
            throw new BadRequestException(`Checkout date must be after check-in date. (チェックアウト日はチェックイン日より後の日付を指定してください)`)
        }
        
        // Calculate total price based on duration of stay　-　宿泊数に基づいた合計金額の計算
        const MILLISECOND_PER_DAY = 1000 * 60 * 60 * 24;
        const howManyStayNight = (checkOutDate.getTime() - checkInDate.getTime()) /MILLISECOND_PER_DAY;
        const pricePerNight = 12000; //テストデータ
        const totalPrice = howManyStayNight * pricePerNight;


        return{//テストデータ
            id: 1,
            user_id: 1,
            room_id: room_id,
            guest_count: guest_count,
            check_in: check_in,
            check_out: check_out,
            total_price: totalPrice,
            status: 'CONFIRMED'
        };
    }
}
