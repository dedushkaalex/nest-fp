import { AuthEntity } from 'src/core/modules/iam/authentication/auth.entity';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends AuthEntity {
  @Column({ length: 100, nullable: true })
  name: string;
}
