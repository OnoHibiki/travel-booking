import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [RoomsModule],
  controllers: [ReservationsController],
  providers: [ReservationsService]
})
export class ReservationsModule {}
