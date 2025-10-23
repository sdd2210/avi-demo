import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MeetingInforService } from './meeting-infor.service';
import { CreateMeetingInforDto } from './dto/create-meeting-infor.dto';
import { UpdateMeetingInforDto } from './dto/update-meeting-infor.dto';

@Controller('meeting-infor')
export class MeetingInforController {
  constructor(private readonly meetingInforService: MeetingInforService) {}

  @Post()
  create(@Body() createMeetingInforDto: CreateMeetingInforDto) {
    return this.meetingInforService.create(createMeetingInforDto);
  }

  @Get()
  findAll() {
    return this.meetingInforService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.meetingInforService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMeetingInforDto: UpdateMeetingInforDto) {
    return this.meetingInforService.update(+id, updateMeetingInforDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingInforService.remove(+id);
  }
}
