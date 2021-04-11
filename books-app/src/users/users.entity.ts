import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { RoleEntity } from '../roles/roles.entity';
import { UserRO } from './dto/users.dto';

var randomstring = require("randomstring");

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({
    type: 'varchar',
    unique: true,
    length:256,
  })
  username: string;

  @OneToMany(() => RoleEntity, role => role.users)
  roles: RoleEntity[];

  @Column('text')
  email: string;

  @Column('text')
  city: string;

  @Column('text')
  country: string;

  @Column('text')
  provider_type: string;

  @Column({
    type:'varchar',
    nullable:true,
  })
  reset_token: string;

  @Column({
    type:'varchar',
    nullable:true,
  })
  user_type: string;

  // @PrimaryColumn()
  // user_type: string;
  // @OneToOne(() => RoleEntity, role => role.id)
  // @JoinColumn({ name: "user_type" })
  // role: RoleEntity;

  @Column({
    type: 'boolean',
    default: false,
  })
  isVerify: Boolean;

  @Column({
    type: 'varchar',
    default: randomstring.generate(30),
  })
  emailCode: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_del: Boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  toResponseObject(showToken: boolean = true): UserRO {
    const { id, created_at, updated_at, username, city, country, provider_type } = this;
    const responseObject: UserRO = {
      id,
      username,
      city,
      country,
      // roles,
      provider_type,
      created_at,
      updated_at
    };
    return responseObject;
  }
}