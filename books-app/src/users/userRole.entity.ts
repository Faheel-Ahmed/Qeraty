import {
  Entity,
  PrimaryColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { UserEntity } from "./users.entity";
import { RoleEntity } from "../roles/roles.entity";

@Entity('user_roles')
export class UserRoleEntity extends BaseEntity {

  @PrimaryColumn()
  user_id: number;
  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @PrimaryColumn()
  role_id: number;
  @ManyToOne(() => RoleEntity, role => role.id)
  @JoinColumn({ name: "role_id" })
  role: RoleEntity;
}