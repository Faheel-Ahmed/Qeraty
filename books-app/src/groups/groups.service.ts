import { Injectable, HttpException, HttpStatus, Post, UseGuards, Response, Body, Headers } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupCategoriesEntity} from './group_categories.entity';
import { GroupSubcategoriesEntity} from './group_subcategories.entity';


@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupSubcategoriesEntity)
    private groupSubcategoriesRepository: Repository<GroupSubcategoriesEntity>,
    @InjectRepository(GroupCategoriesEntity)
    private groupCategoriesRepository: Repository<GroupCategoriesEntity>,
  ) { }


}