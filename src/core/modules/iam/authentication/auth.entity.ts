import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

/** создали так же чтобы не было проблем с типизацией в будущем */
export class AuthEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column()
  email: string;
}
