import { Injectable } from '@nestjs/common';
import { CreateDocummentDto } from './dto/create-documment.dto';
import { UpdateDocummentDto } from './dto/update-documment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Like } from 'typeorm';
import { DocumentEntity } from './entities/documment.entity';
import { FilterDocummentDto } from './dto/filter-documment.dto';
import * as fs from 'fs';
import * as path from 'path';
import meeting_config from '../storage/config/meeting_infor.json'

@Injectable()
export class DocummentService {
  constructor(
      @InjectRepository(DocumentEntity)
      private meetingScheduleRepo: Repository<DocumentEntity>,
  ) {}
  create(createDocummentDto: CreateDocummentDto) {
    return 'This action adds a new documment';
  }

  async findAll(meetid: number, searchBody: FilterDocummentDto) {
    const data = await this.meetingScheduleRepo.find({
      where: {
        meeting_id: meetid,
        deleted_at: IsNull(),
        ...(searchBody.searchText.trim().length > 0 ? {file_name: Like(`%${searchBody.searchText}%`)}:{}),
      }
    })
    return data;
  }

  async findOne(id: number) {
    const data = await this.meetingScheduleRepo.findOne({
      where: {
        id,
        deleted_at: IsNull(),
      }
    })
    return data;
  }

  update(id: number, updateDocummentDto: UpdateDocummentDto) {
    return `This action updates a #${id} documment`;
  }

  remove(id: number) {
    return `This action removes a #${id} documment`;
  }

  findByPath(path: string){
    const file = meeting_config.file?.find((x)=>x.file_path == path);
    return file;
  }
}
