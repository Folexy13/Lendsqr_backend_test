import {Knex} from 'knex';
import { IUserType } from '../interfaces';
import { ConflictError, NotFoundError, UnauthorizedError } from '../exceptions';
import { SHA256 } from 'crypto-js';

export default class UserService {
  private db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  async getAll(): Promise<IUserType[]> {
    return await this.db('users').select('*');
  }

  async getById(id: number): Promise<IUserType | null> {
    const user = await this.db('users').select('*').where({ id }).first();
    return user || null;
  }

 async create(user: IUserType): Promise<IUserType> {
    const existingUser = await this.db('users').where({ email: user.email }).first();
    if (existingUser) {
      throw new ConflictError('User Already Exist')
    }

    // Hash the password using SHA256
    const hashedPassword = SHA256(user.password).toString();

    // Insert the user into the database with the hashed password
    const [id] = await this.db('users').insert({ ...user, password: hashedPassword,wallet:0 });
    
    // Fetch the inserted user from the database and return it
    const createdUser = await this.db('users').where({ id }).first();
    delete createdUser.password; //return without user password for security reason
    return createdUser;
 }
 async login(email: string, password: string): Promise<IUserType> {
    // Fetch the user from the database using the email address
    const user = await this.db('users').where({ email }).first();

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Hash the provided password using SHA256
    const hashedPassword = SHA256(password).toString();

    // Compare the hashed password from the request with the hashed password in the database
    if (user.password !== hashedPassword) {
      throw new UnauthorizedError('Incorrect credentials');
    }

    // Remove the password from the user object and return it
    delete user.password;
    return user;
}

 async update(id: number, user: IUserType): Promise<{ affectedRows: number }> {
  // Check if the user is trying to update the ID or email
  
  if (user.email !== undefined && user.email !== (await this.getUserEmail(id))) {
    throw new Error("Cannot update user email");
  }
//Prevent user from updating thier wallet directly
   if (user.wallet !== undefined) {
    throw new Error("Cannot update user Wallet");
  }
  // Remove the ID field from the user object to prevent accidental updates
  delete user.id;

  const affectedRows = await this.db('users').where({ id }).update(user);
 console.log(affectedRows)
  return { affectedRows };
 }
  private async getUserEmail(id: number): Promise<string> {
  const user = await this.db('users').select('email').where({ id }).first();
  if (!user) {
    throw new Error(`User with ID ${id} not found`);
  }
  return user.email;
}

  async delete(id: number): Promise<{ affectedRows: number }> {
    const affectedRows = await this.db('users').where({ id }).delete();
    return { affectedRows };
  }
}
