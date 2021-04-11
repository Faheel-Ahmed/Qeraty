import { GenreEntity } from "genres/genre.entity";
import {
  Entity,
  PrimaryColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

import { UserEntity } from "../users/users.entity";

@Entity('user_fav_genres')
export class UserFavGenresEntity extends BaseEntity {
  
  @PrimaryColumn()
  user_id: number;
  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @PrimaryColumn()
  genre_id: number;
  @ManyToOne(() => GenreEntity, genre => genre.group_id)
  @JoinColumn({ name: "genre_id" })
  genre: GenreEntity;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_del: Boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}