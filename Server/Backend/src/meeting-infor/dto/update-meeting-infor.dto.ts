import { PartialType } from '@nestjs/mapped-types';
import { CreateMeetingInforDto } from './create-meeting-infor.dto';

export class UpdateMeetingInforDto extends PartialType(CreateMeetingInforDto) {}
