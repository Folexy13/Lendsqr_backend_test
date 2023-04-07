import { NextFunction, Request, Response } from 'express';
import { Knex } from 'knex';
import PaymentService from '../services/Payment.service';

export class PaymentController {
  private paymentService: PaymentService;

  constructor(db: Knex) {
    this.paymentService = new PaymentService(db);
  }

  async pay(req: Request, res: Response) {  
    const { userId, amount, reference } = req.body;

    try {
      const user = await this.paymentService.pay(userId, amount, reference);
      res.json(user);
    } catch (error:any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async withdraw(req: Request, res: Response) {
    const { userId, amount } = req.body;

    try {
      const user = await this.paymentService.withdraw(userId, amount);
      res.json(user);
    } catch (error:any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async fund(req: Request, res: Response) {
    const { userId, amount } = req.body;
    try {
      const user = await this.paymentService.fund(userId, amount);
      return res.status(201).send({status:"success",message:"Wallet top up successfuly",data:user})
    } catch (error: any) {
     return res.status(400).send({status:"failed",message:error.message})
    }
  }
    
  async transfer(req: Request, res: Response) {
    const { senderId, receiverId, amount } = req.body;
    try {
        const transferDetails = await this.paymentService.initTransfer(senderId, receiverId, amount);
        if (transferDetails.status) return res.status(201).send({ status: "success", message: "Transfer successful", data: transferDetails });
        throw transferDetails.message
    } catch (error: any) {
        console.log(error)
     return res.status(400).send({status:"failed",message:error.message ? error.message : error})
    }
  }
}
