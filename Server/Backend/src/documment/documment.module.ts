import { Module } from '@nestjs/common';
import { DocummentService } from './documment.service';
import { DocummentController } from './documment.controller';
import { DocumentEntity } from './entities/documment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentEntity])],
  controllers: [DocummentController],
  providers: [DocummentService],
})
export class DocummentModule {}
