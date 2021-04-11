import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
  UpdateDateColumn
} from 'typeorm';

@Entity('group_categories')
export class GroupCategoriesEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({
    type: 'varchar',
    unique: true,
    length:256,
  })
  name: string;

  @Column({
    type: 'text',
  })
  language: string;

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