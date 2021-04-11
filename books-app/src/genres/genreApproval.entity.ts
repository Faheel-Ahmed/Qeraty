import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    PrimaryColumn   
} from 'typeorm';

import { GenreEntity } from './genre.entity';

@Entity('genres_approval')
export class GenreApprovalEntity extends BaseEntity {

    // @PrimaryGeneratedColumn('increment')
    // id:string

    @PrimaryColumn()
    genre_id: string;
  
    // @OneToOne(() => GenreEntity, genre => genre.group_id)
    // genre_id: GenreEntity;

    @Column({
        type: 'boolean',
    })
    is_approved: Boolean;

    @Column({
        type: 'integer',
        default: false,
    })
    is_del: Number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}