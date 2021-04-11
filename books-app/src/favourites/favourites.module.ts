import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFavAuthorsEntity } from './user_fav_authors.entity';
import { UserFavPublishersEntity } from './user_fav_publishers.entity';
import { UserFavGenresEntity } from './user_fav_genres.entity';
import { UserRoleEntity } from '../users/userRole.entity';
import { GenreEntity } from '../genres/genre.entity';
import { RoleController } from './favourites.controller';
import { FavouritesService } from './favourites.service';

@Module({
  imports: [TypeOrmModule.forFeature([GenreEntity,UserRoleEntity,UserFavAuthorsEntity,UserFavPublishersEntity,UserFavGenresEntity])],
  controllers: [RoleController],
  providers: [FavouritesService],
})
export class FavouritesModule {}