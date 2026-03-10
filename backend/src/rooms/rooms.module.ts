import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { HotelsModule } from 'src/hotels/hotels.module';

@Module({
  imports: [HotelsModule],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService]
})
export class RoomsModule {}
