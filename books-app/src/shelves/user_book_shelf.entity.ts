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
import { ShelveEntity } from './shelves.entity';

@Entity('user_book_shelf')
export class UserBookShelfEntity extends BaseEntity {

  @PrimaryColumn()
  user_id: string;
  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @PrimaryColumn()
  shelf_id: string;
  @ManyToOne(() => ShelveEntity, shelf => shelf.group_id)
  @JoinColumn({ name: "shelf_id" })
  shelf: ShelveEntity;

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
