"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const services_1 = require("../services");
class UserController {
    constructor(knex) {
        this.knex = knex;
        this.userService = new services_1.UserService(knex);
    }
    async getAllUsers(req, res) {
        const users = await this.userService.getAll();
        res.json(users);
    }
    async getUserById(req, res) {
        const { id } = req.params;
        const user = await this.userService.getById(Number(id));
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    async createUser(req, res) {
        try {
            const { name, email, password, wallet } = req.body;
            const newUser = { name, email, password, wallet };
            const createdUser = await this.userService.create(newUser);
            res.status(201).json(createdUser);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.UserController = UserController;
