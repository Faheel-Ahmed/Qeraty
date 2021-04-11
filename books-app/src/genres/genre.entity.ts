import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToOne,
    PrimaryColumn
} from 'typeorm';

import { GenreApprovalEntity } from './genreApproval.entity';

@Entity('genres')
export class GenreEntity extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column({
        type: 'varchar',
        unique: true,
        length:256,
    })
    name: string;

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

    @OneToOne(() => GenreApprovalEntity, genre_approval => genre_approval.genre_id)
    genre_approval: GenreApprovalEntity;


    @PrimaryColumn()
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