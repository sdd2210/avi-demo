import { Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { FilterParticipantDto } from './dto/filter-participant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Repository } from 'typeorm';
import { ParticipantEntity } from './entities/participant.entity';

@Injectable()
export class ParticipantsService {
  constructor(
      @InjectRepository(ParticipantEntity)
      private meetingScheduleRepo: Repository<ParticipantEntity>,
  ) {}
  create(createParticipantDto: CreateParticipantDto) {
    return 'This action adds a new participant';
  }

  findAll() {
    return `This action returns all participants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} participant`;
  }

  update(id: number, updateParticipantDto: UpdateParticipantDto) {
    return `This action updates a #${id} participant`;
  }

  remove(id: number) {
    return `This action removes a #${id} participant`;
  }

  async onSearch(id: number, searchBody: FilterParticipantDto) {
    const data = await this.meetingScheduleRepo.find({
      where: {
        meeting_id: id,
        type: "delegate",
        deleted_at: IsNull(),
        ...(searchBody.searchText.trim().length > 0 ? {full_name: Like(`%${searchBody.searchText}%`)}:{}),
        ...(searchBody.status !== "all" ? {status: searchBody.status}:{}),
      }
    })
    return data;
  }
}
