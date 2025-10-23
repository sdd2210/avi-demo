import { Module } from '@nestjs/common';
import { MeetingScheduleService } from './meeting_schedule.service';
import { MeetingScheduleController } from './meeting_schedule.controller';
import { MeetingScheduleEntity } from './entities/meeting-schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingScheduleEntity])],
  controllers: [MeetingScheduleController],
  providers: [MeetingScheduleService],
})
export class MeetingScheduleModule {}
