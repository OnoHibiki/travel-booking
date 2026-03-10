import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateReservationDto } from './create-reservation.dto';

@Injectable()
export class ReservationsService {
    private reservations = [// TODO:Temporary test data (Pending DB integration) - 一時的なテストデータ（DB連携待ち）
        {
            id: 1,
            user_id: 1,
            room_id: 1,
            guest_count: 2,
            check_in: '2026-04-01',
            check_out: '2026-04-03',
            total_price: 24000,
            status: 'CONFIRMED',
        },
    ];

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
        
        // Check if the room is already reserved for the selected dates - 指定された日程で、指定した部屋がすでに予約されていないか確認
        const overlappedReservation = this.reservations.find((reservation) => {
            const existingCheckIn = new Date(reservation.check_in);
            const existingCheckOut = new Date(reservation.check_out);

            return (
                reservation.room_id === room_id &&
                reservation.status === 'CONFIRMED' &&
                checkInDate < existingCheckOut &&
                checkOutDate > existingCheckIn
            );
        });

        if (overlappedReservation) {
            throw new ConflictException('This room is already reserved for the selected dates. (この部屋は選択した日程ですでに予約されています)')
        }
        
        // Calculate total price based on duration of stay　-　宿泊数に基づいた合計金額の計算
        const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
        const howManyStayNight = (checkOutDate.getTime() - checkInDate.getTime()) /MILLISECONDS_PER_DAY;
        const pricePerNight = 12000; //テストデータ
        const totalPrice = howManyStayNight * pricePerNight;

        //Create New Reservation - 新しい予約を登録
        const newReservation = {
            id: this.reservations.length + 1,
            user_id: 1, //TODO：Test - 仮
            room_id,
            guest_count,
            check_in,
            check_out,
            total_price: totalPrice,
            status: 'CONFIRMED',
        };

        this.reservations.push(newReservation); //Push new Reservation - 新しい予約を予約一覧へ追加

        return newReservation;
    }

    //Get My Reservation - 自分の予約一覧を取得
    findMyReservations() {
        return this.reservations.filter((reservation) => reservation.user_id === 1);
    }
    
    //Cancel the reservation with the specified ID - 指定したIDの予約をキャンセル
    cancelReservation(reservationId: number) {
        const reservation = this.reservations.find((item) => item.id === reservationId);

        //Check if reservation by ID - 引数のIDの予約があるか確認
        if(!reservation){
            throw new NotFoundException('Reservation is not found. (対象の予約が見つかりません)');
        }

        //Verify ownership (Temporary: fixed user_id check) - 所有権の確認　TODO：今は固定値
        if(reservation.user_id !== 1) {
            throw new NotFoundException('Reservation is not found. (対象の予約が見つかりません)');
        }

        // Check if already cancelled - すでにその予約がキャンセルされていないか確認
        if(reservation.status === 'CANCELLED') {
            throw new ConflictException('Reservation is already Cancelled. (この予約はすでにキャンセル済みです)');
        }

        // Update status to CANCELLED - 予約をキャンセル
        reservation.status = 'CANCELLED';

        return reservation;

    }

}
