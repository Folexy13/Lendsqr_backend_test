import Paystack from "paystack";


interface IPaystackService {
  initializeTransaction(amount: number, email: string): Promise<string>;
  verifyTransaction(reference: string): Promise<boolean>;
  transferMoney(amount: number, recipient: string): Promise<boolean>;
}

class PaystackService implements IPaystackService {
    private paystack: any;
    private webhook: any;

constructor(private readonly apiKey:string, private readonly webhookURL: string) {
  this.paystack =  Paystack(this.apiKey);
//   this.webhook =  new Paystack.Webhook(this.apiKey);
  this.webhook.on('charge.success', this.handleTransactionUpdate.bind(this));
  this.webhook.setEndpoint(this.webhookURL);
}

   async initializeTransaction(amount: number, email: string): Promise<string> {
    const response = await this.paystack.transaction.initialize({
      amount: amount * 100,
      email,
    });

    return response.data.authorization_url;
  }
  
   async verifyTransaction(reference: string): Promise<boolean> {
    // Wait for the transaction update to be received at the webhook endpoint
    // Instead of calling the Paystack API to verify the transaction
    return new Promise((resolve, reject) => {
      this.webhook.on('charge.success', (transaction: any) => {
        if (transaction.data.reference === reference && transaction.data.status === 'success') {
          resolve(true);
        } else {
          resolve(false);
        }
      });

      setTimeout(() => {
        reject(new Error('Webhook timeout'));
      }, 30000);
    });
  }

  async transferMoney(amount: number, recipient: string): Promise<any> {
    const response = await this.paystack.transfer.create({
      source: 'balance',
      amount: amount * 100,
      recipient,
    });

    return response.data;
  }
    
  private handleTransactionUpdate(transaction: any) {
    console.log(`Transaction update received: ${transaction.data.reference}`);
  }
}

export default PaystackService;

