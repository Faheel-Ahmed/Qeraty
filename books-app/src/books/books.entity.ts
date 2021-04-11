import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
} from 'typeorm';

@Entity('books')
export class BookEntity extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column({
        type: 'varchar',
        unique: true,
        length:256,
    })
    title: string;

    @Column({
        type: 'varchar',
        unique: true,
        length:256,
    })
    description: string;

    @Column({
        type: 'text',
    })
    language: string;

    // @OneToOne(() => GenreApprovalEntity, genre_approval => genre_approval.genre_id)
    // genre_approval: GenreApprovalEntity;

    @Column({
        type: 'text',
    })
    group_id: string;


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