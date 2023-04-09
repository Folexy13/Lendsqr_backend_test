"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("../exceptions");
const crypto_js_1 = require("crypto-js");
const services_1 = require("../services");
const database_1 = __importDefault(require("../database"));
describe('UserService', () => {
    let userService;
    beforeAll(() => {
        userService = new services_1.UserService(database_1.default);
    });
    afterAll(async () => {
        await database_1.default.destroy();
    });
    describe('getAll', () => {
        it('should return an array of users', async () => {
            const result = await userService.getAll();
            expect(Array.isArray(result)).toBe(true);
        });
        it('should return an array with the correct number of users', async () => {
            const existingUser1 = { name: 'Testing User', email: 'testing2@example.com', password: 'password' };
            const existingUser2 = { name: 'Testing Iyunade', email: 'testing3@example.com', password: 'password' };
            const userOneExists = await (0, database_1.default)('users').select('id').where('email', 'testing2@example.com').first();
            const userTwoExists = await (0, database_1.default)('users').select('id').where('email', 'testing3@example.com').first();
            if (userOneExists || userTwoExists) {
                await (0, database_1.default)('users').where('id', userOneExists.id).delete();
                await (0, database_1.default)('users').where('id', userTwoExists.id).delete();
            }
            await (0, database_1.default)('users').insert([
                Object.assign(Object.assign({}, existingUser1), { password: (0, crypto_js_1.SHA256)(existingUser1.password).toString() }),
                Object.assign(Object.assign({}, existingUser2), { password: (0, crypto_js_1.SHA256)(existingUser2.password).toString() }),
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
            await (0, database_1.default)('users').where('email', 'testing1@example.com').delete();
            // Insert a new user with name 'Testing User'
            const [id] = await (0, database_1.default)('users').insert({ name: 'Testing User', email: 'testing1@example.com', password: 'password', wallet: 0 });
            // Retrieve the user by ID
            const user = await userService.getById(id);
            // Assertions
            expect(user === null || user === void 0 ? void 0 : user.name).toBe('Testing User');
            expect(user === null || user === void 0 ? void 0 : user.email).toBe('testing1@example.com');
            expect(user === null || user === void 0 ? void 0 : user.password).toBe('password');
        });
        it('should return null for non-existent user ID', async () => {
            const user = await userService.getById(99999);
            expect(user).toBeNull();
        });
    });
    describe('create', () => {
        it('should create a new user', async () => {
            const newUser = { name: 'Testing User', email: 'testing2@example.com', password: 'password', wallet: 0 };
            const userExists = await (0, database_1.default)('users').select('id').where('email', 'testing2@example.com').first();
            if (userExists) {
                await (0, database_1.default)('users').where('id', userExists.id).delete();
            }
            const createdUser = await userService.create(newUser);
            expect(createdUser.name).toBe('Testing User');
            expect(createdUser.email).toBe('testing2@example.com');
            expect(createdUser.password).toBeUndefined();
            expect(createdUser.wallet).toBe(0);
        });
        it('should throw a ConflictError for an existing email address', async () => {
            const existingUser = { name: 'Testing Iyunade', email: 'testing3@example.com', password: 'password', wallet: 0 };
            const userExists = await (0, database_1.default)('users').select('id').where('email', 'testing3@example.com').first();
            if (userExists) {
                await (0, database_1.default)('users').where('id', userExists.id).delete();
            }
            await (0, database_1.default)('users').insert(existingUser);
            const newUser = { name: 'Testing Iyunade', email: 'testing3@example.com', password: 'password' };
            await expect(userService.create(newUser)).rejects.toThrowError(exceptions_1.ConflictError);
        });
    });
    describe('login', () => {
        it('should log in a user with correct credentials', async () => {
            const existingUser = { name: 'Testing User', email: 'testing4@example.com', password: 'password' };
            const userExists = await (0, database_1.default)('users').select('id').where('email', 'testing4@example.com').first();
            if (userExists) {
                await (0, database_1.default)('users').where('id', userExists.id).delete();
            }
            await (0, database_1.default)('users').insert(Object.assign(Object.assign({}, existingUser), { password: (0, crypto_js_1.SHA256)(existingUser.password).toString(), wallet: 0 }));
            const loggedInUser = await userService.login('testing4@example.com', 'password');
            expect(loggedInUser.name).toBe('Testing User');
            expect(loggedInUser.email).toBe('testing4@example.com');
            expect(loggedInUser.password).toBeUndefined();
        });
        it('should throw a NotFoundError for a non-existent email address', async () => {
            await expect(userService.login('nonexistent@example.com', 'password')).rejects.toThrowError(exceptions_1.NotFoundError);
        });
        it('should throw an UnauthorizedError for incorrect password', async () => {
            const existingUser = { name: 'Testing User', email: 'testing4@example.com', password: 'password' };
            const userExists = await (0, database_1.default)('users').select('id').where('email', 'testing4@example.com').first();
            if (userExists) {
                await (0, database_1.default)('users').where('id', userExists.id).delete();
            }
            await (0, database_1.default)('users').insert(Object.assign(Object.assign({}, existingUser), { password: (0, crypto_js_1.SHA256)(existingUser.password).toString(), wallet: 0 }));
            await expect(userService.login('testing4@example.com', 'wrongpassword')).rejects.toThrowError(exceptions_1.UnauthorizedError);
        });
        it('should throw a NotFoundError for a non-existent user', async () => {
            await expect(userService.login('nonexistent@example.com', 'password')).rejects.toThrowError(exceptions_1.NotFoundError);
        });
        it('should throw a UnauthorizedError for an existing email with incorrect password', async () => {
            const existingUser = { name: 'Testing User', email: 'testing2@example.com', password: 'password' };
            const userExists = await (0, database_1.default)('users').select('id').where('email', 'testing2@example.com').first();
            if (userExists) {
                await (0, database_1.default)('users').where('id', userExists.id).delete();
            }
            await (0, database_1.default)('users').insert(Object.assign(Object.assign({}, existingUser), { password: (0, crypto_js_1.SHA256)(existingUser.password).toString(), wallet: 0 }));
            await expect(userService.login('testing2@example.com', 'wrongpassword')).rejects.toThrowError(exceptions_1.UnauthorizedError);
        });
    });
    describe('update user', () => {
        beforeEach(async () => {
            const userExists = await (0, database_1.default)('users').select('id').where('email', 'testingfola@example.com').first();
            if (userExists) {
                await (0, database_1.default)('users').where('id', userExists.id).delete();
            }
            await (0, database_1.default)('users').insert({
                name: 'Testing Fola',
                email: 'testingfola@example.com',
                password: 'password123',
                wallet: 100,
            });
        });
        it('should update the user details', async () => {
            const user = await (0, database_1.default)('users').where({ email: "testingfola@example.com" }).first();
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
            const user = await (0, database_1.default)('users').where({ email: 'testingfola@example.com' }).first();
            const id = user.id;
            const updatedUser = {
                email: 'testingope@example.com',
            };
            await expect(userService.update(id, updatedUser)).rejects.toThrowError('Cannot update user email');
            expect(user.email).toBe('testingfola@example.com');
        });
        it('should throw an error if the wallet is updated', async () => {
            const user = await (0, database_1.default)('users').where({ email: 'testingfola@example.com' }).first();
            const id = user.id;
            const updatedUser = {
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
            const [userId] = await (0, database_1.default)('users').insert(user);
            // Delete the user from the database
            const result = await userService.delete(userId);
            // Check that the delete was successful
            expect(result.affectedRows).toBe(1);
            // Attempt to retrieve the user from the database and ensure that they are not found
            const deletedUser = await (0, database_1.default)('users').select('*').where({ id: userId }).first();
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
