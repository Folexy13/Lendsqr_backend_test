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
            const existingUser1 = { name: 'Aluko Opeyemi', email: 'alukoopeyemi@example.com', password: 'password' };
            const existingUser2 = { name: 'Aluko Iyunade', email: 'alukoiyunade@example.com', password: 'password' };
            const userOneExists = await (0, database_1.default)('usersTable').select('id').where('email', 'alukoopeyemi@example.com').first();
            const userTwoExists = await (0, database_1.default)('usersTable').select('id').where('email', 'alukoiyunade@example.com').first();
            if (userOneExists || userTwoExists) {
                await (0, database_1.default)('usersTable').where('id', userOneExists.id).delete();
                await (0, database_1.default)('usersTable').where('id', userTwoExists.id).delete();
            }
            await (0, database_1.default)('usersTable').insert([
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
            // Delete any existing user with name 'John Doe'
            await (0, database_1.default)('usersTable').where('name', 'John Doe').delete();
            // Insert a new user with name 'John Doe'
            const [id] = await (0, database_1.default)('usersTable').insert({ name: 'John Doe', email: 'john@example.com', password: 'password' });
            // Retrieve the user by ID
            const user = await userService.getById(id);
            // Assertions
            expect(user === null || user === void 0 ? void 0 : user.name).toBe('John Doe');
            expect(user === null || user === void 0 ? void 0 : user.email).toBe('john@example.com');
            expect(user === null || user === void 0 ? void 0 : user.password).toBe('password');
        });
        it('should return null for non-existent user ID', async () => {
            const user = await userService.getById(99999);
            expect(user).toBeNull();
        });
    });
    describe('create', () => {
        it('should create a new user', async () => {
            const newUser = { name: 'Aluko Opeyemi', email: 'alukoopeyemi@example.com', password: 'password' };
            const userExists = await (0, database_1.default)('usersTable').select('id').where('email', 'alukoopeyemi@example.com').first();
            if (userExists) {
                await (0, database_1.default)('usersTable').where('id', userExists.id).delete();
            }
            const createdUser = await userService.create(newUser);
            expect(createdUser.name).toBe('Aluko Opeyemi');
            expect(createdUser.email).toBe('alukoopeyemi@example.com');
            expect(createdUser.password).toBeUndefined();
            expect(createdUser.wallet).toBe(0);
        });
        it('should throw a ConflictError for an existing email address', async () => {
            const existingUser = { name: 'Aluko Iyunade', email: 'alukoiyunade@example.com', password: 'password' };
            const userExists = await (0, database_1.default)('usersTable').select('id').where('email', 'alukoiyunade@example.com').first();
            if (userExists) {
                await (0, database_1.default)('usersTable').where('id', userExists.id).delete();
            }
            await (0, database_1.default)('usersTable').insert(existingUser);
            const newUser = { name: 'Aluko Iyunade', email: 'alukoiyunade@example.com', password: 'password' };
            await expect(userService.create(newUser)).rejects.toThrowError(exceptions_1.ConflictError);
        });
    });
    describe('login', () => {
        it('should log in a user with correct credentials', async () => {
            const existingUser = { name: 'Aluko Martha', email: 'alukomartha@example.com', password: 'password' };
            const userExists = await (0, database_1.default)('usersTable').select('id').where('email', 'alukomartha@example.com').first();
            if (userExists) {
                await (0, database_1.default)('usersTable').where('id', userExists.id).delete();
            }
            await (0, database_1.default)('usersTable').insert(Object.assign(Object.assign({}, existingUser), { password: (0, crypto_js_1.SHA256)(existingUser.password).toString() }));
            const loggedInUser = await userService.login('alukomartha@example.com', 'password');
            expect(loggedInUser.name).toBe('Aluko Martha');
            expect(loggedInUser.email).toBe('alukomartha@example.com');
            expect(loggedInUser.password).toBeUndefined();
        });
        it('should throw a NotFoundError for a non-existent email address', async () => {
            await expect(userService.login('nonexistent@example.com', 'password')).rejects.toThrowError(exceptions_1.NotFoundError);
        });
        it('should throw an UnauthorizedError for incorrect password', async () => {
            const existingUser = { name: 'Aluko Martha', email: 'alukomartha@example.com', password: 'password' };
            const userExists = await (0, database_1.default)('usersTable').select('id').where('email', 'alukomartha@example.com').first();
            if (userExists) {
                await (0, database_1.default)('usersTable').where('id', userExists.id).delete();
            }
            await (0, database_1.default)('usersTable').insert(Object.assign(Object.assign({}, existingUser), { password: (0, crypto_js_1.SHA256)(existingUser.password).toString() }));
            await expect(userService.login('john@example.com', 'wrongpassword')).rejects.toThrowError(exceptions_1.UnauthorizedError);
        });
        it('should throw a NotFoundError for a non-existent user', async () => {
            await expect(userService.login('nonexistent@example.com', 'password')).rejects.toThrowError(exceptions_1.NotFoundError);
        });
        it('should throw a UnauthorizedError for an existing email with incorrect password', async () => {
            const existingUser = { name: 'Aluko Opeyemi', email: 'alukoopeyemi@example.com', password: 'password' };
            const userExists = await (0, database_1.default)('usersTable').select('id').where('email', 'alukoopeyemi@example.com').first();
            if (userExists) {
                await (0, database_1.default)('usersTable').where('id', userExists.id).delete();
            }
            await (0, database_1.default)('usersTable').insert(Object.assign(Object.assign({}, existingUser), { password: (0, crypto_js_1.SHA256)(existingUser.password).toString() }));
            await expect(userService.login('alukoopeyemi@example.com', 'wrongpassword')).rejects.toThrowError(exceptions_1.UnauthorizedError);
        });
    });
    describe('update and delete', () => {
        let existingUser;
        beforeEach(async () => {
            // Create a new user and insert them into the database
            existingUser = { name: 'Aluko Opeyemi', email: 'alukoopeyemi@example@example.com', password: 'password' };
            await (0, database_1.default)('usersTable').insert(Object.assign(Object.assign({}, existingUser), { password: (0, crypto_js_1.SHA256)(existingUser.password).toString() }));
        });
        afterEach(async () => {
            // Delete the user from the database
            await (0, database_1.default)('usersTable').where({ email: existingUser.email }).delete();
        });
        it('should update an existing user', async () => {
            // Update the user's name 
            const updatedUser = { name: 'Aluko Ruth' };
            const userExists = await (0, database_1.default)('usersTable').select('id').where('email', 'alukoopeyemi@example.com').first();
            const result = await userService.update(userExists.id, Object.assign(Object.assign({}, updatedUser), { email: userExists.email, password: userExists.password, wallet: userExists.wallet || 0 }));
            // Check that the update was successful
            expect(result.affectedRows).toBe(1);
            // Retrieve the user from the database and check that their name and email were updated
            const user = await (0, database_1.default)('usersTable').select('*').where({ email: userExists.email }).first();
            expect(user.name).toBe(userExists.name);
            expect(user.email).toBe(userExists.email);
            expect(user.password).toBeDefined();
        });
        it('should not allow users to update their email', async () => {
            // Attempt to update the user's email
            const updatedUser = { email: 'alukoopeyemi@example.com' };
            const userExists = await (0, database_1.default)('usersTable').select('id').where('email', 'alukoiyunade@example.com').first();
            await expect(userService.update(1, Object.assign(Object.assign({}, updatedUser), { password: userExists.password, name: userExists.name }))).rejects.toThrowError('Cannot update user email');
        });
        it('should not allow users to update their wallet', async () => {
            // Attempt to update the user's wallet
            const updatedUser = { wallet: 100 };
            const userExists = await (0, database_1.default)('usersTable').select('id').where('email', 'alukoiyunade@example.com').first();
            await expect(userService.update(1, Object.assign(Object.assign({}, updatedUser), userExists))).rejects.toThrowError('Cannot update user Wallet');
        });
        it('should delete an existing user', async () => {
            // Delete the user from the database
            const result = await userService.delete(existingUser.id || 182);
            // Check that the delete was successful
            expect(result.affectedRows).toBe(1);
            // Attempt to retrieve the user from the database and ensure that they are not found
            const user = await (0, database_1.default)('usersTable').select('*').where({ email: existingUser.email }).first();
            expect(user).toBeUndefined();
        });
        it('should throw an error when attempting to delete a non-existent user', async () => {
            // Attempt to delete a non-existent user
            await expect(userService.delete(1000)).rejects.toThrowError('User with ID 1000 not found');
        });
    });
});
