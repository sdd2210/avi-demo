import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { MeetingScheduleEntity } from './entities/meeting-schedule.entity';

@Injectable()
export class MeetingScheduleService {
    constructor(
        @InjectRepository(MeetingScheduleEntity)
        private meetingScheduleRepo: Repository<MeetingScheduleEntity>,
    ) {}

    async findByMeetingId (id: number) {
        const data = await this.meetingScheduleRepo.find({
            where: {
                meeting_id: id,
                deleted_at: IsNull(),
            }
        });

        return data;
    }
}
