import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMeetingInforDto } from './dto/create-meeting-infor.dto';
import { UpdateMeetingInforDto } from './dto/update-meeting-infor.dto';
import { MeetingInforEntity } from './entities/meeting-infor.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class MeetingInforService {
  constructor(
    @InjectRepository(MeetingInforEntity)
    private meetingInforRepo: Repository<MeetingInforEntity>,
  ) {}

  create(createMeetingInforDto: CreateMeetingInforDto) {
    return 'This action adds a new meetingInfor';
  }

  findAll() {
    return `This action returns all meetingInfor`;
  }

  async findOne(id: number) {
    const meetingDetail = await this.meetingInforRepo.findOne({where: {
      id: id,
      deleted_at: IsNull(),
    }})
    return meetingDetail;
  }

  update(id: number, updateMeetingInforDto: UpdateMeetingInforDto) {
    return `This action updates a #${id} meetingInfor`;
  }

  remove(id: number) {
    return `This action removes a #${id} meetingInfor`;
  }
}
