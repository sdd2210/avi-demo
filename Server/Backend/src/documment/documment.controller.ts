import { Controller, Get, Post, Body, Patch, Param, Delete, StreamableFile, Res } from '@nestjs/common';
import { DocummentService } from './documment.service';
import { CreateDocummentDto } from './dto/create-documment.dto';
import { UpdateDocummentDto } from './dto/update-documment.dto';
import { createReadStream } from 'fs';
import { join } from 'path';
import { FilterDocummentDto } from './dto/filter-documment.dto';
import type { Response } from 'express';

@Controller('document')
export class DocummentController {
  constructor(private readonly docummentService: DocummentService) {}

  // @Post()
  // create(@Body() createDocummentDto: CreateDocummentDto) {
  //   return this.docummentService.create(createDocummentDto);
  // }

  // @Get()
  // findAll() {
  //   console.log(join(process.cwd(), 'package.json'));
  //   return this.docummentService.findAll();
  // }

  @Get('/file/:id')
  async findOne(@Param('id') id: string): Promise<StreamableFile | undefined> {
    const doc = await this.docummentService.findOne(+id);
    if(doc){
      const filepath = join(process.cwd(), doc?.file_path ?? '');
      const file = createReadStream(filepath);
      return new StreamableFile(file, {
        type: doc.file_type,
      });
    }
    return undefined;
  }

  @Get('/stream-file/:path')
  async getFileStream(@Param('path') path: string): Promise<StreamableFile | undefined> {
    const doc = this.docummentService.findByPath(path);
    if(doc){
      const filepath = join(process.cwd(), doc?.file_path ?? '');
      const file = createReadStream(filepath);
      return new StreamableFile(file, {
        type: doc.file_type,
      });
    }
    return undefined;
  }

  @Get('/download/:id')
  async download(@Param('id') id: string, @Res() res: Response) {
    const doc = await this.docummentService.findOne(+id);
    if(doc){
      const filepath = join(process.cwd(), doc?.file_path ?? '');
      return res.download(filepath, doc.file_name, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
    return undefined;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocummentDto: UpdateDocummentDto) {
    return this.docummentService.update(+id, updateDocummentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.docummentService.remove(+id);
  }

  @Post(":meetid")
  async getListMeetingDoc(@Param('meetid') id: string, @Body() body: FilterDocummentDto) {
    return await this.docummentService.findAll(+id, body);
  }
}
