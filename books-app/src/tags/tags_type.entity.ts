import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from "typeorm";

@Entity('tags_type')
export class TagsTypeEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({
    type: 'varchar',
    default: false,
    length:256,
  })
  name: string;

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