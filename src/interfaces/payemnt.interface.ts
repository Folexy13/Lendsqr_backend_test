export interface IPaystackBank {
    name: string,
    code: string,
    active: boolean,
    country: string,
    currency: string,
    type: string
}
  
export interface IAccountNameEnqury {
    bankCode: string, 
    accountNumber: string
}

export interface IPaystackResolveAccount {
    account_name: string
}

export interface IPaymentInitializeRequest  {
  amount: number,
  accountNumber?:number
     userId?: IUser
}

export interface IUser {
    name?: string,
  email?: string
  id?:number
}

export interface IPaymentInitializeResponse {
    paymentProviderRedirectUrl: string
    paymentReference: string,
    accessCode: string
}

export interface IPaymentResponse{
  status: boolean | string,
  message: string,
  data?:any
}

export interface IPaymentTransferRequest{
  senderId:number,
  receiverId:number,
  amount:number
}