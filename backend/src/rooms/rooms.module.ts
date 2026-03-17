import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { HotelsModule } from 'src/hotels/hotels.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [HotelsModule],
  controllers: [RoomsController],
  providers: [RoomsService, PrismaService],
  exports: [RoomsService]
})
export class RoomsModule {}
