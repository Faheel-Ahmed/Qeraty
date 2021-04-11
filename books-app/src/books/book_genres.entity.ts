import { GenreEntity } from 'genres/genre.entity';
import {
    Entity,
    Column,
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    JoinColumn,
    ManyToOne
} from 'typeorm';
import { BookEntity } from './books.entity';


@Entity('book_genres')
export class BookGenresEntity extends BaseEntity {

    @PrimaryColumn()
    book_id: number;
    @ManyToOne(() => BookEntity, book => book.group_id)
    @JoinColumn({ name: "book_id" })
    book: BookEntity;

    @PrimaryColumn()
    genre_id: number;
    @ManyToOne(() => GenreEntity, genre => genre.id)
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