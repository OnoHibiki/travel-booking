import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateReservationDto } from './create-reservation.dto';
import { RoomsService } from 'src/rooms/rooms.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Reservation, Room } from '@prisma/client';

@Injectable()
export class ReservationsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly roomsService: RoomsService,   
    ){}

    private toReservationSummary(reservation: Reservation, room?: Room ) {
        return {
            id: reservation.id,
            guestCount: reservation.guest_count,
            checkIn: reservation.check_in,
            checkOut: reservation.check_out,
            totalPrice: reservation.total_price,
            status: reservation.status,
            ...(room && {
                room: {
                    id: room.id,
                    name: room.name,
                },
            }),
        };
    }

    private toReservationDetail(reservation: Reservation, room: Room ) {
        return {
            id: reservation.id,
            guestCount: reservation.guest_count,
            checkIn: reservation.check_in,
            checkOut: reservation.check_out,
            totalPrice: reservation.total_price,
            status: reservation.status,
            room: {
                id: room.id,
                name: room.name,
                capacity: room.capacity,
                pricePerNight: room.price_per_night,
            },
        };
    }

    private 

    async createReservation(userId: number, createReservationDto: CreateReservationDto) {

        const { room_id, guest_count, check_in, check_out} = createReservationDto;
        
        // Check minimum guest count - 最小宿泊人数のチェック
        if (guest_count < 1) {
            throw new BadRequestException(`Guest count must be at least 1. (宿泊人数は１以上で指定してください)`)
        }

        //Find room by room_id - room_idから部屋情報を取得
        const room = await this.roomsService.findOne(room_id);

        // Check room capacity - 部屋の定数を予約人数が超えていないか確認
        if(guest_count > room.capacity) {
            throw new BadRequestException(
                'Guest count exceeds room capacity. (宿泊人数が部屋の定員を超えています)'
            );
        }

        //Validate that check-in date is before check-out date　-　チェックイン日がチェックアウト日より前であるかのチェック
        const checkInDate = new Date(check_in);
        const checkOutDate = new Date(check_out);
        if(checkInDate >= checkOutDate) {
            throw new BadRequestException(`Checkout date must be after check-in date. (チェックアウト日はチェックイン日より後の日付を指定してください)`)
        }
        
        // Check if the room is already reserved for the selected dates - 指定された日程で、指定した部屋がすでに予約されていないか確認
        const overlappedReservation = await this.prisma.reservation.findFirst({
            where : {
                room_id,
                status: 'CONFIRMED',
                AND: [
                    { check_in: { lt: checkOutDate}},
                    { check_out: { gt: checkInDate}},
                ],
            },
        });

        if (overlappedReservation) {
            throw new ConflictException('This room is already reserved for the selected dates. (この部屋は選択した日程ですでに予約されています)')
        }
        
        // Calculate total price based on duration of stay　-　宿泊数に基づいた合計金額の計算
        const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
        const howManyStayNight = (checkOutDate.getTime() - checkInDate.getTime()) /MILLISECONDS_PER_DAY;
        const pricePerNight = room.price_per_night;
        const totalPrice = howManyStayNight * pricePerNight;

        //Create New Reservation - 新しい予約を登録
        return this.prisma.reservation.create({
            data: {
                user_id: userId,
                room_id,
                guest_count,
                check_in: checkInDate,
                check_out: checkOutDate,
                total_price: totalPrice,
                status: 'CONFIRMED',
            },
        });
    }

    //Get My Reservation - 自分の予約一覧を取得
    async findMyReservations(userId: number){
        const reservations = await this.prisma.reservation.findMany({
            where: { user_id: userId },
            orderBy: { check_in: 'asc'},
        });

        return Promise.all(
            reservations.map(async (reservation) => {
                const room = await this.roomsService.findOne(reservation.room_id);
                return this.toReservationSummary(reservation, room);
            })
        )

    }

    //Get My specific Reservation - 自分の特定の予約を取得
    async findOne(userId: number, reservationId: number) {
        const reservation = await this.prisma.reservation.findUnique({
            where: {id: reservationId},
        });

        if(!reservation) {
            throw new NotFoundException('Reservation not found. (対象の予約が見つかりません)');
        }

        if(reservation.user_id !== userId) {
            throw new NotFoundException('Reservation not found (あなたの予約ではありません)');
        }

        const room = await this.roomsService.findOne(reservation.room_id);

        return this.toReservationDetail(reservation, room);
    }
    
    //Cancel the reservation with the specified ID - 指定したIDの予約をキャンセル
    async cancelReservation(userId:number, reservationId: number) {
        const reservation = await this.prisma.reservation.findUnique({
            where: { id: reservationId},
        });

        //Check if reservation by ID - 引数のIDの予約があるか確認
        if(!reservation){
            throw new NotFoundException('Reservation is not found. (対象の予約が見つかりません)');
        }

        //Verify ownership - 自分の予約か確認
        if(reservation.user_id !== userId) {
            throw new NotFoundException('Reservation is not found. (対象の予約が見つかりません)');
        }

        // Check if already cancelled - すでにその予約がキャンセルされていないか確認
        if(reservation.status === 'CANCELLED') {
            throw new ConflictException('Reservation is already Cancelled. (この予約はすでにキャンセル済みです)');
        }

        // Update status to CANCELLED - 予約をキャンセル
        const updated = await this.prisma.reservation.update({
            where: { id: reservationId },
            data: { status: 'CANCELLED'},
        });

        const room = await this.roomsService.findOne(updated.room_id);

        return this.toReservationDetail(updated, room);

    }

}
