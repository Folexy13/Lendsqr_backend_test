"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("../exceptions");
const crypto_js_1 = require("crypto-js");
class UserService {
    constructor(db) {
        this.db = db;
    }
    async getAll() {
        return await this.db('usersTable').select('*');
    }
    async getById(id) {
        const user = await this.db('usersTable').select('*').where({ id }).first();
        return user || null;
    }
    async create(user) {
        const existingUser = await this.db('usersTable').where({ email: user.email }).first();
        if (existingUser) {
            throw new exceptions_1.ConflictError('User Already Exist');
        }
        // Hash the password using SHA256
        const hashedPassword = (0, crypto_js_1.SHA256)(user.password).toString();
        // Insert the user into the database with the hashed password
        const [id] = await this.db('usersTable').insert(Object.assign(Object.assign({}, user), { password: hashedPassword, wallet: 0 }));
        // Fetch the inserted user from the database and return it
        const createdUser = await this.db('usersTable').where({ id }).first();
        delete createdUser.password; //return without user password for security reason
        return createdUser;
    }
    async login(email, password) {
        // Fetch the user from the database using the email address
        const user = await this.db('usersTable').where({ email }).first();
        if (!user) {
            throw new exceptions_1.NotFoundError('User not found');
        }
        // Hash the provided password using SHA256
        const hashedPassword = (0, crypto_js_1.SHA256)(password).toString();
        // Compare the hashed password from the request with the hashed password in the database
        if (user.password !== hashedPassword) {
            throw new exceptions_1.UnauthorizedError('Incorrect credentials');
        }
        // Remove the password from the user object and return it
        delete user.password;
        return user;
    }
    async update(id, user) {
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
        const affectedRows = await this.db('usersTable').where({ id }).update(user);
        console.log(affectedRows);
        return { affectedRows };
    }
    async getUserEmail(id) {
        const user = await this.db('usersTable').select('email').where({ id }).first();
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        return user.email;
    }
    async delete(id) {
        const affectedRows = await this.db('usersTable').where({ id }).delete();
        return { affectedRows };
    }
}
exports.default = UserService;
