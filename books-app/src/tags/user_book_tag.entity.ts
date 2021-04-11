import { BookEntity } from "books/books.entity";
import {
  Entity,
  PrimaryColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne
} from "typeorm";
import { UserEntity } from "users/users.entity";
import { TagsEntity } from './tags.entity';

@Entity('user_book_tag')
export class UserBookTagEntity extends BaseEntity {

  @PrimaryColumn()
  user_id: string;
  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @PrimaryColumn()
  tag_id: string;
  @ManyToOne(() => TagsEntity, tag => tag.id)
  @JoinColumn({ name: "tag_id" })
  tag: TagsEntity;

  @PrimaryColumn()
  book_id: string;
  @ManyToOne(() => BookEntity, book => book.group_id)
  @JoinColumn({ name: "book_id" })
  book: BookEntity;

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
