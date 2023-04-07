"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const services_1 = require("../services");
class UserController {
    constructor(knex) {
        this.knex = knex;
        this.userService = new services_1.UserService(this.knex);
    }
    async getAllUsers(req, res) {
        const users = await this.userService.getAll();
        return res.status(201).send({ status: "success", message: "Users fetched Succesful", data: users });
    }
    async getUserById(req, res) {
        const { id } = req.params;
        const user = await this.userService.getById(Number(id));
        if (user) {
            return res.status(201).send({ status: "success", message: "User fetched Succesful", data: user });
        }
        else {
            return res.status(404).send({ status: "failed", error: 'User not found' });
        }
    }
    async createUser(req, res) {
        try {
            const { name, email, password, wallet } = req.body;
            const newUser = { name, email, password, wallet };
            const createdUser = await this.userService.create(newUser);
            return res.status(201).send({ status: "success", message: "Registration Successful", data: createdUser });
        }
        catch (error) {
            return res.status(400).send({ status: "failed", message: error.message });
        }
    }
    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            const user = await this.userService.login(email, password);
            return res.status(201).send({ status: "success", message: "Login Succesful", data: user });
        }
        catch (error) {
            return res.status(400).send({ status: "failed", message: error.message });
        }
    }
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name, email, password, wallet } = req.body;
            const updatedUser = { id: Number(id), name, email, password, wallet };
            const result = await this.userService.update(Number(id), updatedUser);
            if (result.affectedRows === 0) {
                res.status(404).send({ status: "failed", error: 'User not found' });
            }
            else {
                res.status(200).send({ status: "success", message: 'User details updated successfully' });
            }
        }
        catch (error) {
            res.status(400).send({ status: "failed", error: error.message });
        }
    }
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const result = await this.userService.delete(Number(id));
            if (result.affectedRows === 0) {
                res.status(404).send({ status: "failed", error: 'User not found' });
            }
            else {
                res.status(200).send({ status: "success", message: 'User deleted successfully' });
            }
        }
        catch (error) {
            res.status(400).send({ status: "failed", error: error.message });
        }
    }
}
exports.UserController = UserController;
