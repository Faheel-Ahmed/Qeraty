import {
  Controller,
  Post,
  Body,
  Response,
  UseGuards,
  Headers,
  Query
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDTO } from './dto/create-tag.dto';
import { AuthGuard } from '../shared/auth.gaurd';
import { AddBookToTagDTO } from './dto/add_book_to_tag.dto';

@Controller('api/v1')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Post('tag') 
  @UseGuards(new AuthGuard())
  async createTag(@Response() res,@Body() createTagDTO: CreateTagDTO,@Headers() headers: Headers) {
      return this.tagsService.createTag(res,createTagDTO,headers);
  }

  @Post('tag/book') 
  @UseGuards(new AuthGuard())
  async addBookToShelf(@Response() res,@Query() addBookToShelfDTO: AddBookToTagDTO,@Headers() headers: Headers) {
      return this.tagsService.addBookToTag(res,addBookToShelfDTO,headers);
  }
}