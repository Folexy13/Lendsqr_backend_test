import { NextFunction, Request, Response } from 'express';
import { Knex } from 'knex';
import TransactionService from '../services/Payment.service';
import { paginate } from '../utils';

export class PaymentController {
  private TransactionService: TransactionService;

  constructor(db: Knex) {
    this.TransactionService = new TransactionService(db);
  }
   async getAllTransactions(req: Request, res: Response): Promise<void | Response> {
    const users = await this.TransactionService.getAll();
    return res.status(201).send({status:"success",message:"Transactions fetched Succesful",response:paginate(users)})
  }
  async pay(req: Request, res: Response) {  
    const { userId, amount } = req.body;
    try {
      const transaction = await this.TransactionService.pay({userId, amount});
      res.status(200).send({status:"success",message:"Transaction initialized successfully. Please wait while we verify your payment. You will receive a notification once the transaction is completed.",data:transaction});
    } catch (error:any) {
      res.status(error.statusCode || 500).send({status:"failed", message: error.message });
    }
  }
  async verify(req: Request, res: Response) {  
    const { reference } = req.params;
    try {
      const user:any = await this.TransactionService.verify(reference);
      res.status(200).send({status:"success",messge:`Payment was ${user.gateway_response}`});
    } catch (error:any) {
      res.status(error.statusCode || 500).send({status:"failed", message: error.message });
    }
  }
  async withdraw(req: Request, res: Response) {
    const { userId, amount } = req.body;

    try {
    } catch (error:any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

 
  async transfer(req: Request, res: Response) {
    try {
      const response = await this.TransactionService.transfer(req.body)
      return res.status(200).send(response);
    } catch (error: any) {
     return res.status(400).send({status:"failed",message:error.message ? error.message : error})
    }
  }
}
