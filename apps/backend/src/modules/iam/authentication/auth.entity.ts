import { BaseEntity } from '@/core/lib/base-entity';
import { Exclude } from 'class-transformer';
import { Column } from 'typeorm';

/** создали так же чтобы не было проблем с типизацией в будущем */
export class AuthEntity extends BaseEntity {
  @Exclude()
  @Column()
  password: string;

  @Column({ unique: true })
  email: string;
}
