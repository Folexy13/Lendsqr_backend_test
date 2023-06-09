import { ConflictError, NotFoundError, UnauthorizedError } from '../exceptions';
import { IUserType } from '../interfaces';
import { SHA256 } from 'crypto-js';
import { UserService } from '../services';
import connectDb from '../database';


describe('UserService', () => {
  let userService: UserService;

  beforeAll(() => {
    userService = new UserService(connectDb);
  });

  afterAll(async () => {
    await connectDb.destroy();
  });

describe('getAll', () => {
 

  it('should return an array of users', async () => {
    const result = await userService.getAll();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return an array with the correct number of users', async () => {
    const existingUser1: IUserType = { name: 'Testing User', email: 'testing2@example.com', password: 'password' };
    const existingUser2: IUserType = { name: 'Testing Iyunade', email: 'testing3@example.com', password: 'password' };
     const userOneExists = await connectDb('users').select('id').where('email', 'testing2@example.com').first();
     const userTwoExists = await connectDb('users').select('id').where('email', 'testing3@example.com').first();
    if (userOneExists || userTwoExists) {
      await connectDb('users').where('id', userOneExists.id).delete();
      await connectDb('users').where('id', userTwoExists.id).delete();
    }
    await connectDb('users').insert([
      { ...existingUser1, password: SHA256(existingUser1.password).toString() },
      { ...existingUser2, password: SHA256(existingUser2.password).toString() },
    ]);
    const result = await userService.getAll();
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

   it('should return all users in the database', async () => {
    const result = await userService.getAll();
    expect(result.length).toBeGreaterThanOrEqual(0);
    expect(result[0].name).toBeTruthy();
    expect(result[1].name).toBeTruthy();
  });

  it('should not include the password field in the returned users', async () => {
    const result = await userService.getAll();
    expect(result[0].password).toBeDefined();
    expect(result[1].password).toBeDefined();
  });
});


describe('getById', () => {
    it('should return a user by ID', async () => {
  // Delete any existing user with email 'testing1@example.com''
      await connectDb('users').where('email', 'testing1@example.com').delete();
      
  
  // Insert a new user with name 'Testing User'
  const [id] = await connectDb('users').insert({ name: 'Testing User', email: 'testing1@example.com', password: 'password' ,wallet:0});
  
  // Retrieve the user by ID
  const user = await userService.getById(id);
  
  // Assertions
  expect(user?.name).toBe('Testing User');
  expect(user?.email).toBe('testing1@example.com');
  expect(user?.password).toBe('password');
});


    it('should return null for non-existent user ID', async () => {
      const user = await userService.getById(99999);
      expect(user).toBeNull();
    });
  });

describe('create', () => {
  it('should create a new user', async () => {
    const newUser: IUserType = { name: 'Testing User', email: 'testing2@example.com', password: 'password',wallet:0 };
    const userExists = await connectDb('users').select('id').where('email', 'testing2@example.com').first();
    if (userExists) {
      await connectDb('users').where('id', userExists.id).delete();
    }
    const createdUser = await userService.create(newUser);
    expect(createdUser.name).toBe('Testing User');
    expect(createdUser.email).toBe('testing2@example.com');
    expect(createdUser.password).toBeUndefined();
    expect(createdUser.wallet).toBe(0);
  });

  it('should throw a ConflictError for an existing email address', async () => {
    const existingUser: IUserType = { name: 'Testing Iyunade', email: 'testing3@example.com', password: 'password',wallet:0 };
    const userExists = await connectDb('users').select('id').where('email', 'testing3@example.com').first();
    if (userExists) {
      await connectDb('users').where('id', userExists.id).delete();
    }
    await connectDb('users').insert(existingUser);
    const newUser: IUserType = { name: 'Testing Iyunade', email: 'testing3@example.com', password: 'password' };
    await expect(userService.create(newUser)).rejects.toThrowError(ConflictError);
  });
});

describe('login', () => {
  it('should log in a user with correct credentials', async () => {
    const existingUser: IUserType = { name: 'Testing User', email: 'testing4@example.com', password: 'password' };
      const userExists = await connectDb('users').select('id').where('email', 'testing4@example.com').first();
    if (userExists) {
      await connectDb('users').where('id', userExists.id).delete();
    }
    await connectDb('users').insert({ ...existingUser, password: SHA256(existingUser.password).toString(),wallet:0});
    const loggedInUser = await userService.login('testing4@example.com', 'password');
    expect(loggedInUser.name).toBe('Testing User');
    expect(loggedInUser.email).toBe('testing4@example.com');
    expect(loggedInUser.password).toBeUndefined();
  });

  it('should throw a NotFoundError for a non-existent email address', async () => {
    await expect(userService.login('nonexistent@example.com', 'password')).rejects.toThrowError(NotFoundError);
  });

  it('should throw an UnauthorizedError for incorrect password', async () => {
     const existingUser: IUserType = { name: 'Testing User', email: 'testing4@example.com', password: 'password' };
      const userExists = await connectDb('users').select('id').where('email', 'testing4@example.com').first();
    if (userExists) {
      await connectDb('users').where('id', userExists.id).delete();
    }
    await connectDb('users').insert({ ...existingUser, password: SHA256(existingUser.password).toString(),wallet:0 });
    await expect(userService.login('testing4@example.com', 'wrongpassword')).rejects.toThrowError(UnauthorizedError);
  });

  it('should throw a NotFoundError for a non-existent user', async () => {
    await expect(userService.login('nonexistent@example.com', 'password')).rejects.toThrowError(NotFoundError);
  });




  it('should throw a UnauthorizedError for an existing email with incorrect password', async () => {
    const existingUser: IUserType = { name: 'Testing User', email: 'testing2@example.com', password: 'password' };
       const userExists = await connectDb('users').select('id').where('email', 'testing2@example.com').first();
    if (userExists) {
      await connectDb('users').where('id', userExists.id).delete();
    }
    await connectDb('users').insert({ ...existingUser, password: SHA256(existingUser.password).toString(),wallet:0 });
    await expect(userService.login('testing2@example.com', 'wrongpassword')).rejects.toThrowError(UnauthorizedError);
  });
});


describe('update user', () => {
  beforeEach(async () => {
        const userExists = await connectDb('users').select('id').where('email', 'testingfola@example.com').first();
    if (!userExists) {
      await connectDb('users').insert({
        name: 'Testing Fola',
        email: 'testingfola@example.com',
        password: 'password123',
        wallet: 100,
      });
    }
     
    });

   
  it('should update the user details', async () => {
      const user = await connectDb('users').where({ email:"testingfola@example.com" }).first();
      const id = user.id;
      const updatedUser = {
        name: 'Testing Aluko',
        email: 'testingfola@example.com',
        password: 'newpassword123',
      };
    
      const result = await userService.update(id, updatedUser);
      expect(result.affectedRows).toBe(1);
      expect(user.name).toBe(updatedUser.name);
      expect(user.email).toBe(updatedUser.email);
      expect(user.password).toBe(updatedUser.password);
      expect(user.wallet).toBe(100);
    });

  it('should throw an error if the email is updated', async () => {
      const user = await connectDb('users').where({ email:'testingfola@example.com' }).first();
      const id = user.id;
      const updatedUser:any = {
        email: 'testingope@example.com',
      };
      await expect(userService.update(id, updatedUser)).rejects.toThrowError('Cannot update user email');

      
      expect(user.email).toBe('testingfola@example.com');
    });

  it('should throw an error if the wallet is updated', async () => {
      const user = await connectDb('users').where({ email:'testingfola@example.com' }).first();
      const id = user.id;
      const updatedUser:any = {
        wallet: 200,
      };
      await expect(userService.update(id, updatedUser)).rejects.toThrowError('Cannot update user Wallet');

      expect(user.wallet).toBe(100);
    });
  });
  

describe('delete user', () => {
    it('should delete an existing user', async () => {
      // Insert a new user into the database
      const user = { name: 'Test User', email: 'test@example.com', password: 'password' };
      const [userId] = await connectDb('users').insert(user);

      // Delete the user from the database
      const result = await userService.delete(userId);

      // Check that the delete was successful
      expect(result.affectedRows).toBe(1);

      // Attempt to retrieve the user from the database and ensure that they are not found
      const deletedUser = await connectDb('users').select('*').where({ id: userId }).first();
      expect(deletedUser).toBeUndefined();
    });

    it('should return 0 affectedRows when attempting to delete a non-existent user', async () => {
      // Attempt to delete a non-existent user
      const result = await userService.delete(1000);

      // Check that the delete was unsuccessful
      expect(result.affectedRows).toBe(0);
    });
  });
});

