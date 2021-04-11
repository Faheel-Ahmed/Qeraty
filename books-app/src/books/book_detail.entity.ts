import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BaseEntity,
    OneToOne,
    PrimaryColumn,
    JoinColumn,
    UpdateDateColumn
} from 'typeorm';
import { UserEntity } from "../users/users.entity";
import { GenreEntity } from "../genres/genre.entity";
import { getNullableType } from 'graphql';
import { BookEntity } from './books.entity';


@Entity('books-detail')
export class BookDetailEntity extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column({
        type: 'varchar',
        unique: true,
        length:256,
    })
    isbn: string;

    // @Column()
    // author_id: number;
    // @OneToOne(() => UserEntity, user => user.id)
    // @JoinColumn({ name: "author_id" })
    // author: UserEntity;

    // @Column()
    // publisher_id: number;
    // @OneToOne(() => UserEntity, user => user.id)
    // @JoinColumn({ name: "publisher_id" })
    // publisher: UserEntity;


    // @PrimaryColumn()
    // genre_id: number;
    // @OneToOne(() => GenreEntity, genre => genre.id)
    // @JoinColumn({ name: "genre_id" })
    // genre: GenreEntity;

    @PrimaryColumn()
    book_id: number;
    @OneToOne(() => BookEntity, book => book.group_id)
    @JoinColumn({ name: "book_id" })
    book: BookEntity;

    @Column({
        type: 'text',
    })
    discount_percentage: string;

    @Column({
        type: 'text',
    })
    price: string;

    @Column({
        type: 'text',
    })
    no_of_pages: string;

    @Column({
        type: 'date',
    })
    publish_date: string;

    @Column({
        type: 'text',
    })
    format: string;

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