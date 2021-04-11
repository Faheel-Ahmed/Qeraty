import {
  Entity,
  PrimaryColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn
} from "typeorm";
import { ShelveEntity } from "./shelves.entity";


@Entity('shelves_type')
export class ShelvesTypeEntity extends BaseEntity {

  @PrimaryColumn()
  shelf_id: number;
  @OneToOne(() => ShelveEntity, shelf => shelf.group_id)
  @JoinColumn({ name: "shelf_id" })
  shelf: ShelveEntity;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_common: Boolean;

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