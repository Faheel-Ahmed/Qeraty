import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsEntity } from './tags.entity';
import { UserBookTagEntity } from './user_book_tag.entity';
import { TagsTypeEntity } from './tags_type.entity';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([TagsEntity,UserBookTagEntity,TagsTypeEntity])],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}