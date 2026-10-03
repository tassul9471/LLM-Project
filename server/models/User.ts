import { JsonCollection, BaseDoc } from '../utils/storage.js';

export interface IUser extends BaseDoc {
  name: string;
  email: string;
  passwordHash: string;
  role?: 'user' | 'admin';
}

export const UserModel = new JsonCollection<IUser>('users');
