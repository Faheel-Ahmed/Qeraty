import {
    Entity,
    Column,
    PrimaryColumn,
    CreateDateColumn,
    BaseEntity,
    JoinColumn,
    ManyToOne,
    UpdateDateColumn
} from 'typeorm';
import { UserEntity } from '../users/users.entity';
import { BookEntity } from './books.entity';


@Entity('book_authors')
export class BookAuthorsEntity extends BaseEntity {

    @PrimaryColumn()
    book_id: number;
    @ManyToOne(() => BookEntity, book => book.group_id)
    @JoinColumn({ name: "book_id" })
    book: BookEntity;

    @PrimaryColumn()
    author_id: number;
    @ManyToOne(() => UserEntity, user => user.id)
    @JoinColumn({ name: "author_id" })
    user: UserEntity;

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