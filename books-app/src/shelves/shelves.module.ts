import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShelveEntity } from './shelves.entity';
import { UserBookShelfEntity } from './user_book_shelf.entity';
import { ShelvesTypeEntity } from './shelves_type.entity';
import { ShelvesController } from './shelves.controller';
import { ShelvesService } from './shelves.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShelveEntity,UserBookShelfEntity,ShelvesTypeEntity])],
  controllers: [ShelvesController],
  providers: [ShelvesService],
})
export class ShelvesModule {}