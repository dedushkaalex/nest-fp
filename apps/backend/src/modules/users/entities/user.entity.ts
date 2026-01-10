import { AuthEntity } from '../../iam/authentication/auth.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends AuthEntity {
  @Column({ length: 100, nullable: true })
  name: string;
}
