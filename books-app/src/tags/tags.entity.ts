import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
  OneToMany,
  JoinColumn,
  UpdateDateColumn
} from 'typeorm';
import { TagsTypeEntity } from './tags_type.entity';

@Entity('tags')
export class TagsEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({
      type: 'varchar',
      unique: true,
      length:256,
  })
  name: string;

  @Column()
  type: number;
  @OneToMany(() => TagsTypeEntity, tags_type => tags_type.id)
  @JoinColumn({ name: "type" })
  tags_type: TagsTypeEntity;

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