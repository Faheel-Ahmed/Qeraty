import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany
} from "typeorm";

import { UserEntity } from "../users/users.entity";

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length:256,
  })
  name: string;

  @OneToMany(() => UserEntity, user => user.roles)
  users: UserEntity[];
}