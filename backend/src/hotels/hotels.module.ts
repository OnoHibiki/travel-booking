import { Module } from '@nestjs/common';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { RoomsModule } from '..//rooms/rooms.module'; //Serviceではなく、モジュール単位で追加する
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [HotelsController],
  providers: [HotelsService, PrismaService],
  exports: [HotelsService]
})
export class HotelsModule {}
