import { IsNotEmpty } from 'class-validator';

export class FavouritesDTO {

  role_id: string;

  favourite_genres: [];

  favourite_authors: [];

  favourite_publishers: [];
}