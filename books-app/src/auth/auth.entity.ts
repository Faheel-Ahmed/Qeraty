import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';

@Entity('auth')

export class AuthEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column('text')
  provider_user_key: string;

  @Column('text')
  provider_type: string;

  @Column('text')
  user_id: string;

}