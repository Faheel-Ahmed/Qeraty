import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn
} from 'typeorm';
import { GroupCategoriesEntity } from './group_categories.entity';

@Entity('group_subcategories')
export class GroupSubcategoriesEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({
    type: 'varchar',
    unique: true,
    length:256,
  })
  name: string;

  @Column()
  parent_id: number;
  @ManyToOne(() => GroupCategoriesEntity, category => category.id)
  @JoinColumn({ name: "parent_id" })
  group_category: GroupCategoriesEntity;

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