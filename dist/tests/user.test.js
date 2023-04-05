"use strict";
// import { DB_HOST, DB_NAME, DB_PASS, DB_USER } from '../config';
// import { UserType } from '../interfaces';
// import { Knex } from 'knex'
// class UsersTable {
//   private db: Knex;
//   constructor() {
//     this.db = connectToDatabase
//   }
//   async initialize() {
//     await this.db.migrate.latest();
//   }
//   async cleanup() {
//     await this.db.destroy();
//   }
//   async clear() {
//     await this.db('users').truncate();
//   }
//   async create(newUser: UserType) {
//     const createdUser = await this.db('users').insert(newUser);
//     return createdUser[0];
//   }
//  async getAll(where: Record<string, any> = {}): Promise<UserType[] > {
//   const query = this.db.select().from('users');
//   if (Object.keys(where).length) {
//     query.where(where);
//   }
//   return query;
// }
// }
// describe('Users table', () => {
//   let usersTable: UsersTable;
//   beforeAll(async () => {
//     usersTable = new UsersTable();
//     await usersTable.initialize();
//   });
//   afterAll(async () => {
//     await usersTable.cleanup();
//   });
//   afterEach(async () => {
//     await usersTable.clear();
//   });
//   it('should create a new user', async () => {
//     const newUser: UserType = {
//       fullname: 'John Doe',
//       email: 'johndoe@example.com',
//       password: 'password123',
//       wallet: 0
//     };
//     const createdUserId = await usersTable.create(newUser);
//     // const createdUser = await usersTable.getAll({ id: createdUserId }).first();
//     const createdUser = await usersTable.getAll({ id: createdUserId });
//     expect(createdUser).toHaveProperty('id');
//     expect(createdUser).toMatchObject(newUser);
//   });
//   it('should get all users', async () => {
//     const users = [
//       {
//         fullname: 'Aluko Opeyemi',
//         email: 'aluko@gmail.com',
//         password: 'alukoopeyemi',
//         wallet:0
//       },
//       {
//         fullname: 'Aluko Iyunade',
//         email: 'iyunade@gmail.com',
//         password: 'alukoiyunade',
//         wallet:0
//       },
//     ];
//     await usersTable.create(users[0]);
//     await usersTable.create(users[1]);
//     const allUsers = await usersTable.getAll();
//     expect(allUsers).toHaveLength(2);
//     expect(allUsers).toMatchObject(users);
//   });
// });
