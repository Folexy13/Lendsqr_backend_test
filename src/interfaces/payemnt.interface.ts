export interface TransferRecipient {
  type: 'nuban';
  name: string;
  account_number: string;
  bank_code: string;
}

export interface TransferInitiationData {
  source: 'balance';
  reason: string;
  amount: number;
  recipient: string;
  reference: string;
}

export interface TransferInitiationResponse {
  status: boolean;
  message?: string;
  data?: {
    transfer_code: string;
    reference: string;
  };
}

export interface TransferCompletionData {
  transfer_code: string;
  otp: string;
}
