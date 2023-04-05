// import { connectToDB } from 'utils';
// import { UserType } from '../interfaces';
// import knex from 'knex';



// class UsersTable {
//   private db;

//   constructor() {
//     this.db = connectToDB
//   }

//   async create(newUser: UserType) {
//     const createdUser = await this.db('users').insert(newUser);
//     return createdUser[0];
//   }

//   async getAll() {
//     return this.db('users');
//   }

//   async clear() {
//     await this.db('users').truncate();
//   }

//   async migrate() {
//     await this.db.migrate.latest();
//   }

//   async destroy() {
//     await this.db.destroy();
//   }
// }

// describe('Users table', () => {
//   let usersTable: UsersTable;

//   beforeAll(async () => {
//     usersTable = new UsersTable();
//     await usersTable.migrate();
//   });

//   afterAll(async () => {
//     await usersTable.destroy();
//   });

//   afterEach(async () => {
//     await usersTable.clear();
//   });

//   it('should create a new user', async () => {
//     const newUser: UserType = {
//       fullname: 'John Doe',
//       email: 'johndoe@example.com',
//       password: 'password123',
//       wallet:0
//     };

//     const createdUserId = await usersTable.create(newUser);

//     expect(createdUserId).toBeDefined();
//   });

//   it('should get all users', async () => {
//     const users = [
//       {
//         fullname: 'John Doe',
//         email: 'johndoe@example.com',
//         password: 'password123',
//         wallet:0
//       },
//       {
//         fullname: 'Jane Doe',
//         email: 'janedoe@example.com',
//         password: 'password456',
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
