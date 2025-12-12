export interface User {
  id: number;
  fullname: string;
  email: string;
  number: string;
  password: string;
}

export type UserResponse = Omit<User, 'password'>;
