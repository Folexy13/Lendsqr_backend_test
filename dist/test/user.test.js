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
            const [id] = await (0, database_1.default)('users').insert({ name: 'Testing User', email: 'testing1@example.com', password: 'password' });
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
            const newUser = { name: 'Testing User', email: 'testing2@example.com', password: 'password' };
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
            const existingUser = { name: 'Testing Iyunade', email: 'testing3@example.com', password: 'password' };
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
            await (0, database_1.default)('users').insert(Object.assign(Object.assign({}, existingUser), { password: (0, crypto_js_1.SHA256)(existingUser.password).toString() }));
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
            await (0, database_1.default)('users').insert(Object.assign(Object.assign({}, existingUser), { password: (0, crypto_js_1.SHA256)(existingUser.password).toString() }));
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
            await (0, database_1.default)('users').insert(Object.assign(Object.assign({}, existingUser), { password: (0, crypto_js_1.SHA256)(existingUser.password).toString() }));
            await expect(userService.login('testing2@example.com', 'wrongpassword')).rejects.toThrowError(exceptions_1.UnauthorizedError);
        });
    });
    describe('update and delete', () => {
        let existingUser;
        beforeEach(async () => {
            // Create a new user and insert them into the database
            existingUser = { name: 'Testing User', email: 'testing2@example@example.com', password: 'password' };
            await (0, database_1.default)('users').insert(Object.assign(Object.assign({}, existingUser), { password: (0, crypto_js_1.SHA256)(existingUser.password).toString() }));
        });
        afterEach(async () => {
            // Delete the user from the database
            await (0, database_1.default)('users').where({ email: existingUser.email }).delete();
        });
        it('should update an existing user', async () => {
            // Update the user's name 
            const updatedUser = { name: 'Testing Ruth' };
            const userExists = await (0, database_1.default)('users').select('id').where('email', 'testing2@example.com').first();
            const result = await userService.update(userExists.id, Object.assign(Object.assign({}, updatedUser), { email: userExists.email, password: userExists.password, wallet: userExists.wallet || 0 }));
            // Check that the update was successful
            expect(result.affectedRows).toBe(1);
            // Retrieve the user from the database and check that their name and email were updated
            const user = await (0, database_1.default)('users').select('*').where({ email: userExists.email }).first();
            expect(user.name).toBe(userExists.name);
            expect(user.email).toBe(userExists.email);
            expect(user.password).toBeDefined();
        });
        it('should not allow users to update their email', async () => {
            // Attempt to update the user's email
            const updatedUser = { email: 'testing2@example.com' };
            const userExists = await (0, database_1.default)('users').select('id').where('email', 'testing3@example.com').first();
            await expect(userService.update(1, Object.assign(Object.assign({}, updatedUser), { password: userExists.password, name: userExists.name, wallet: userExists.wallet || 0 }))).rejects.toThrowError('Cannot update user email');
        });
        it('should not allow users to update their wallet', async () => {
            // Attempt to update the user's wallet
            const updatedUser = { wallet: 100 };
            const userExists = await (0, database_1.default)('users').select('id').where('email', 'testing3@example.com').first();
            await expect(userService.update(1, Object.assign(Object.assign({}, updatedUser), userExists))).rejects.toThrowError('Cannot update user Wallet');
        });
        it('should delete an existing user', async () => {
            // Delete the user from the database
            const result = await userService.delete(existingUser.id || 1);
            // Check that the delete was successful
            expect(result.affectedRows).toBe(1);
            // Attempt to retrieve the user from the database and ensure that they are not found
            const user = await (0, database_1.default)('users').select('*').where({ email: existingUser.email }).first();
            expect(user).toBeUndefined();
        });
        it('should throw an error when attempting to delete a non-existent user', async () => {
            // Attempt to delete a non-existent user
            await expect(userService.delete(1000)).rejects.toThrowError('User with ID 1000 not found');
        });
    });
});
