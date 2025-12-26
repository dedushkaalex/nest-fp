export interface IUser {
  id: number;
  fullname: string;
  email: string;
  number: string;
  password: string;
}

export type IUserResponse = Omit<IUser, 'password'>;
