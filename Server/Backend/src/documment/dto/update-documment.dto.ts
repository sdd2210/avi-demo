import { PartialType } from '@nestjs/mapped-types';
import { CreateDocummentDto } from './create-documment.dto';

export class UpdateDocummentDto extends PartialType(CreateDocummentDto) {}
