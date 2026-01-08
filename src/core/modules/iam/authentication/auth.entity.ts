import { Exclude } from 'class-transformer';
import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

/** создали так же чтобы не было проблем с типизацией в будущем */
export class AuthEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column()
  password: string;

  @Column({ unique: true })
  email: string;
}
