import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupCategoriesEntity } from './group_categories.entity';
import { GroupSubcategoriesEntity } from './group_subcategories.entity';

import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroupCategoriesEntity,GroupSubcategoriesEntity])],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}