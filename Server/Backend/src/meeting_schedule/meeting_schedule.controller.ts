import { Controller, Get, Param } from '@nestjs/common';
import { MeetingScheduleService } from './meeting_schedule.service';

@Controller('meeting-schedule')
export class MeetingScheduleController {
  constructor(private readonly meetingScheduleService: MeetingScheduleService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.meetingScheduleService.findByMeetingId(+id);
  }
}
