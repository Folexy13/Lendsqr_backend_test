import { NextFunction, Request, Response } from 'express';
import { Knex } from 'knex';
import { paginate } from '../utils';
import { TransactionService } from '../services';

export class PaymentController {
  private TransactionService: TransactionService;

  constructor(db: Knex) {
    this.TransactionService = new TransactionService(db);
  }
   async getAllTransactions(req: Request, res: Response): Promise<void | Response> {
    const users = await this.TransactionService.getAll();
    return res.status(201).send({status:"success",message:"Transactions fetched Succesful",response:paginate(users)})
   }
  async getAllBanks(req: Request, res: Response): Promise<void | Response> {
     const {country} = req.params
    const banks = await this.TransactionService.getBankList(country);
    return res.status(201).send({status:"success",message:"Paystack banks",banks})
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

  async withdraw(req: Request, res: Response) {
    try {
      const response = await this.TransactionService.withdraw(req.body)
      if (response.status === 'otp') {
      return res.status(200).send({status:"success",message:"Check your email for Otp to continue with the transaction"});
      }
      if (response.status === "success") {
      return res.status(200).send({status:"success",message:"Your payment has been initiated successfully"});
      }
    } catch (error: any) {  
      console.log(error)
      return res.status(error.statusCode || 500).send({ message: error.message });
    }
  }

   async verifyWithdraw(req: Request, res: Response) {
     try {
       const {reference, otp} = req.body
       const response = await this.TransactionService.verifyWithdraw(reference, otp)
       console.log(response)
      if (response.status === 'success') {
      return res.status(200).send({status:"success",message:"Otp verified!,you should receive your money anytime soon"});
      }
    } catch (error: any) {  
      return res.status(error.statusCode || 500).send({ message: error.response.data.message });
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

   async verify(req: Request, res: Response) {  
     const { event, data } = req.body;
     console.log('webhook is called')
     console.log(req.body)
    await this.TransactionService.verify(event, data)
    res.send(200)
  }
}
