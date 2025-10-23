import { Module } from '@nestjs/common';
import { MeetingInforService } from './meeting-infor.service';
import { MeetingInforController } from './meeting-infor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingInforEntity } from './entities/meeting-infor.entity';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingInforEntity]), DatabaseModule],
  controllers: [MeetingInforController],
  providers: [MeetingInforService],
})
export class MeetingInforModule {}
