import { Model } from 'objection';

export class User extends Model {
  static get tableName(): string {
    return 'usersTable';
  }

  id!: number;
  name!: string;
  email!: string;
  password!: string;
  created_at!: Date;
  updated_at!: Date;
}
