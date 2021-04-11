import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";


@Entity('shelves')
export class ShelveEntity extends BaseEntity {
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
  group_id: string;

  @Column({
    type: 'text',
  })
  language: string;

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