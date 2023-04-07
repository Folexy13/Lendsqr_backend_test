import { Knex } from 'knex';
import axios,{Axios, AxiosResponse} from 'axios';
import { IAccountNameEnqury, IPaymentInitializeRequest, IPaymentInitializeResponse, IPaymentTransferRequest, IPaymentResponse, IPaystackBank, IPaystackResolveAccount, IUserType } from '../interfaces';
import {  BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../exceptions';
import { PAYSTACK_BASE_URL, PAYSTACK_SECRET_KEY } from '../config';


export default class TransactionService {
  private db: Knex;
  private paystackBaseUrl: any

  constructor(db: Knex) {
    this.db = db;
    this.paystackBaseUrl = PAYSTACK_BASE_URL;
  }
  async getAll(): Promise<IUserType[]> {
    return await this.db('transactions').select('*');
  }
  private async getBankList(country: string): Promise<IPaystackBank[]>{
    const baseUrl = this.paystackBaseUrl + `/bank/?country=${country}`
     const headers = {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'content-type': 'application/json',
        'cache-control': 'no-cache'
     }
    try {
       const response: AxiosResponse<any> = await axios.get(baseUrl, {headers})
       if( !response.data && response.status !== 200 ){
        throw new Error('An error occurred with our third party. Please try again at a later time.')
       } 
     const paystackBanks: IPaystackBank[] = response.data.data 
     return paystackBanks 
    } catch (error) {
      throw new BadRequestError('An error occurred with our third party. Please try again at a later time.')
    }
  }
  private async accountNameInquiry(data: IAccountNameEnqury): Promise<IPaystackResolveAccount>{
    const {bankCode, accountNumber} = data
    const baseURL =  this.paystackBaseUrl + `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`
  const headers = {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    'content-type': 'application/json',
    'cache-control': 'no-cache'
  }
  try{
    const response: AxiosResponse<any> = await axios.get(baseURL, { headers })
    if(!response.data && response.status !== 200){
        throw new BadRequestError('An error occurred with our third party. Please try again at a later time.')
    }
    const payStackResolveAccount : IPaystackResolveAccount = response.data.data
    return payStackResolveAccount
  } catch (e) {
    throw new BadRequestError('An error occurred with our third party. Please try again at a later time.')
  }
  }
  async pay(data: IPaymentInitializeRequest): Promise<IPaymentInitializeResponse> {
    const {userId,amount}= data
    try {
      const user = await this.db('users').where({ id: userId }).first();

    if (!user) {
      throw new NotFoundError('User not found');
    }
    const base_url = this.paystackBaseUrl + `/transaction/initialize`
     const headers = {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'content-type': 'application/json',
      'cache-control': 'no-cache'
     }
      const chargeAmount = (amount || 0) * 100
    const payload: any = {
      amount: chargeAmount,
      email: user.email,
      metadata: {
        full_name: user.name
      }
    }
      const response: AxiosResponse<any> = await axios.post(base_url, payload, {
        headers
      })
      if(!response.data && response.status !== 200){
        throw new BadRequestError('An error occurred with our third party. Please try again at a later time.')
    }
      const { authorization_url, reference, access_code } = response.data.data
      await this.db('transactions').insert({ reference,type:"Wallet Funding",user_id:user.id,amount:chargeAmount/100,gateway:"Paystack",status:'pending'});
      return {
        paymentProviderRedirectUrl: authorization_url,
        paymentReference: reference,
        accessCode: access_code
      }
    } catch(e:any){
      console.log(`e message`, e.message)
      console.log(e.stack)
      throw e
    }
   
  }
  async verify(reference: string): Promise<IPaymentResponse | undefined>{
    const isTransaction: any = await this.db('transactions').where({ reference }).first()
    try {
      if (!isTransaction) {
      throw new NotFoundError('Transaction not found');
      }

      if (isTransaction.status ==="completed") {
      throw new ConflictError('Transaction already verified');
      }
      const user : any = await this.db('users').where({id: isTransaction.user_id }).first()
     const baseURL = this.paystackBaseUrl + `/transaction/verify/${reference}`
    const headers = {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    'content-type': 'application/json',
    'cache-control': 'no-cache'
    }
      const response: AxiosResponse<any> = await axios.get(baseURL, { headers })
      
      if(!response.data && response.status !== 200){
        throw new BadRequestError('An error occurred with our third party. Please try again at a later time.')
      }
      const verificationResponse: IPaymentResponse = response.data.data
        await this.db('users').where({id:user.id}).update({wallet: user.wallet + isTransaction.amount})
        await this.db('transactions').where({ reference }).update({status:"completed"})
     return verificationResponse
    } catch (error) {
      throw error
   }
  }
  // async withdraw(userId: number, amount: number): Promise<IUserType> {
  //   const user = await this.db('users').where({ id: userId }).first();

  //   if (!user) {
  //     throw new NotFoundError('User not found');
  //   }

  //   if (user.wallet < amount) {
  //     throw new UnauthorizedError('Insufficient funds');
  //   }

  //   const transaction:any = await this.paystack.transfer.initiate({
  //     source: 'balance', // Withdraw from the Paystack balance
  //     amount: amount * 100, // Paystack requires amount to be in kobo (i.e. smallest currency unit)
  //     recipient: user.email,
  //     reference: `withdrawal-${Date.now()}`,
  //   });

  //   return {
  //     ...user,
  //     wallet: user.wallet - amount,
  //     transactionId: transaction.data.transfer_code,
  //   };
  // }

 async transfer(data:IPaymentTransferRequest): Promise<IPaymentResponse | undefined> {
   const { senderId, receiverId, amount } = data
   try {
      const sender:any = await this.db('users').where({ id: senderId }).first();
      const receiver:any = await this.db('users').where({ id: receiverId }).first();
    if (sender.wallet < amount) {
      throw new ConflictError('Insufficient funds');
    }
     if (!sender || !receiver) {
      throw new NotFoundError(`${!sender? "Sender":"Receiver"} not found`);
     }
     let reference = 'lendsqr-transfer'+ Date.now()
     await this.db('transactions').insert({reference,type:"Transfer",amount,status:'completed',user_id:senderId,gateway:'Paystack'})
     await this.db('transactions').insert({reference,type:"Gift",amount,status:'completed',user_id:receiverId,gateway:'Paystack'})
     await this.db('users').where({ id: senderId }).update({wallet : sender.wallet - amount})
     await this.db('users').where({ id: receiverId }).update({wallet : receiver.wallet + amount})
     return  {status:"success",message:"Transfer was successful"}
   } catch (error) {
    throw error
   }
}

}

