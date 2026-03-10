//Data type definition for POST (reservation) requests - POST（予約）で送られてくる、データ型の定義

export class CreateReservationDto {
    room_id: number ;
    guest_count : number ;
    check_in : string ;
    check_out : string ;
}