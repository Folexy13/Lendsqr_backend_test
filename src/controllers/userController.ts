import { Request, Response } from 'express';
import { UserType } from '../interfaces';
import { Knex } from 'knex';
import { UserService } from '../services';

export class UserController {
  private userService: UserService;

  constructor(private knex: Knex) {
    this.userService = new UserService(knex);
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    const users = await this.userService.getAll();
    res.json(users);
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const user = await this.userService.getById(Number(id));
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, wallet } = req.body;
      const newUser: UserType = { name, email, password, wallet };
      const createdUser = await this.userService.create(newUser);
      res.status(201).json(createdUser);
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  }

  // async updateUser(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { id } = req.params;
  //     const { name, email, password, wallet } = req.body;
  //     const updatedUser: UserType = { id: Number(id), name, email, password, wallet };
  //     const result:any = await this.userService.update(Number(id), updatedUser);
  //     if (result.affectedRows === 0) {
  //       res.status(404).json({ error: 'User not found' });
  //     } else {
  //       res.status(200).json({ message: 'User updated successfully' });
  //     }
  //   } catch (error:any) {
  //     res.status(400).json({ error: error.message });
  //   }
  // }

  // async deleteUser(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { id } = req.params;
  //     const result:any = await this.userService.delete(Number(id));
  //     if (result.affectedRows === 0) {
  //       res.status(404).json({ error: 'User not found' });
  //     } else {
  //       res.status(200).json({ message: 'User deleted successfully' });
  //     }
  //   } catch (error:any) {
  //     res.status(400).json({ error: error.message });
  //   }
  // }
}
