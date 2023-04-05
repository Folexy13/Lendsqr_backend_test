"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserService {
    constructor(db) {
        this.db = db;
    }
    async getAll() {
        return await this.db('users').select('*');
    }
    async getById(id) {
        const user = await this.db('users').select('*').where({ id }).first();
        return user || null;
    }
    async create(user) {
        const [id] = await this.db('users').insert(user);
        const createdUser = Object.assign({ id }, user);
        return createdUser;
    }
}
exports.default = UserService;
