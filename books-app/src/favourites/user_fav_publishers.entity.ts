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

@Entity('user_fav_publishers')
export class UserFavPublishersEntity extends BaseEntity {
  
  @PrimaryColumn()
  user_id: number;
  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @PrimaryColumn()
  publisher_id: number;
  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: "publisher_id" })
  publisher: UserEntity;

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