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

@Entity('user_fav_authors')
export class UserFavAuthorsEntity extends BaseEntity {

  @PrimaryColumn()
  user_id: number;
  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @PrimaryColumn()
  author_id: number;
  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: "author_id" })
  author: UserEntity;

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