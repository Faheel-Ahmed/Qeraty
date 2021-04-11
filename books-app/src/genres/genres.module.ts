import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreEntity } from './genre.entity';
import { GenreApprovalEntity } from './genreApproval.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GenreEntity,GenreApprovalEntity])],
  controllers: [GenresController],
  providers: [GenresService],
  exports: [
    GenresService
  ]
})
export class GenresModule { }