import {Knex} from 'knex';
import { UserType } from '../interfaces';

export default class UserService {
  private db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  async getAll(): Promise<UserType[]> {
    return await this.db('users').select('*');
  }

  async getById(id: number): Promise<UserType | null> {
    const user = await this.db('users').select('*').where({ id }).first();
    return user || null;
  }

  async create(user: UserType): Promise<UserType> {
    const [id] = await this.db('users').insert(user);
    const createdUser = { id, ...user };
    return createdUser;
  }

  // async update(id: number, user: UserType): Promise<{ affectedRows: number |  }> {
  //   const [affectedRows] = await this.db('users').where({ id }).update(user);
  //   return { affectedRows };
  // }

  // async delete(id: number): Promise<{ affectedRows: number }> {
  //   const [affectedRows] = await this.db('users').where({ id }).delete();
  //   return { affectedRows };
  // }
}
