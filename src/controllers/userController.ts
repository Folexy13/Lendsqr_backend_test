import { Request, Response } from 'express';
import { IUserType } from '../interfaces';
import { Knex } from 'knex';
import { UserService } from '../services';
import { paginate } from '../utils';

export class UserController {
  private userService: UserService;

  constructor(private knex: Knex) {
    this.userService = new UserService(this.knex);
  }

  async getAllUsers(req: Request, res: Response): Promise<void | Response> {
    const users = await this.userService.getAll();
    return res.status(201).send({status:"success",message:"Users fetched Succesful",response:paginate(users)})
  }

async getUserById(req: Request, res: Response): Promise<void | Response> {
  try {
    const { id } = req.params;
    const user = await this.userService.getById(Number(id));
    if (user) {
      return res.status(201).send({status:"success",message:"User fetched Succesful",data:user})
    } else {
      return res.status(404).send({ status:"failed",error: 'User not found' });
    }
  } catch (err:any) {
    return res.status(500).send({ status: "failed", error: err.message });
  }
}
  
  async createUser(req: Request, res: Response): Promise<void | Response> {
    try {
      const { name, email, password, wallet } = req.body;
      const newUser: IUserType = { name, email, password, wallet };
      const createdUser = await this.userService.create(newUser);
      return res.status(201).send({status:"success",message:"Registration Successful",data:createdUser});
    } catch (error:any) {
      return res.status(400).send({status:"failed",message:error.message})
    }
  }

  async loginUser(req: Request, res: Response): Promise<void | Response>{
    try {
       const { email, password } = req.body;
      const user = await this.userService.login(email, password);
      return res.status(201).send({status:"success",message:"Login Succesful",data:user})
    } catch (error:any) {
      return res.status(400).send({status:"failed",message:error.message})
    }
  }
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email, password, wallet } = req.body;
      const updatedUser: IUserType = { id: Number(id), name, email, password, wallet };
      const result:any = await this.userService.update(Number(id), updatedUser);
      if (result.affectedRows === 0) {
        res.status(404).send({ status:"failed",error: 'User not found' });
      } else {
        res.status(200).send({status:"success", message: 'User details updated successfully' });
      }
    } catch (error:any) {
      res.status(400).send({status:"failed", error: error.message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result:any = await this.userService.delete(Number(id));
      if (result.affectedRows === 0) {
         res.status(404).send({ status:"failed",error: 'User not found' });
      } else {
         res.status(200).send({status:"success", message: 'User deleted successfully' });
      }
    } catch (error:any) {
      res.status(400).send({ status:"failed",error: error.message });
    }
  }
}
