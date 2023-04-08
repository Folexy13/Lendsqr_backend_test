import {Knex} from 'knex';
import { IPaystackBank, IPaystackResolveAccount } from '../interfaces';
import { BadRequestError } from '../exceptions';
import { TransactionService } from '../services';
import connectDb from '../database';

jest.mock('../api', () => {
  const mockApi = {
    get: jest.fn(),
    post: jest.fn(),
  };
  return { PaystackApi: jest.fn(() => mockApi) };
});

const mockDb = {
  select: jest.fn(),
  where: jest.fn(),
  first: jest.fn(),
  insert: jest.fn(),
};

describe('TransactionService', () => {
  let transactionService: TransactionService;
  beforeEach(() => {
    transactionService = new TransactionService(connectDb);
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should call db.select with proper arguments', async () => {
      mockDb.select.mockResolvedValueOnce([]);
      await transactionService.getAll();
      expect(mockDb.select).toHaveBeenCalledWith('*');
      expect(mockDb.select).toHaveBeenCalledWith('transactions');
    });
  });

  describe('getBankList', () => {
    it('should call PaystackApi.get with proper arguments and return paystackBanks', async () => {
      const mockResponse:any = [
        { id: 1, name: 'bank1', slug: 'bank1', code: '001' },
        { id: 2, name: 'bank2', slug: 'bank2', code: '002' },
      ];
      const mockQuery = 'Nigeria';
      const mockUrl = `/bank?country=${mockQuery}`;
      const mockGet = jest.fn().mockResolvedValueOnce(mockResponse);
      transactionService.api.get = mockGet;
      const result = await transactionService.getBankList(mockQuery);
      expect(mockGet).toHaveBeenCalledWith(mockUrl);
      expect(result).toEqual(mockResponse);
    });

    it('should throw a BadRequestError when PaystackApi.get returns an error', async () => {
      const mockError = new Error('PaystackApi error');
      const mockQuery = 'Nigeria';
      const mockUrl = `/bank?country=${mockQuery}`;
      const mockGet = jest.fn().mockRejectedValueOnce(mockError);
      transactionService.api.get = mockGet;
      await expect(transactionService.getBankList(mockQuery)).rejects.toThrowError(
        new BadRequestError('An error occurred with our third party. Please try again at a later time.')
      );
      expect(mockGet).toHaveBeenCalledWith(mockUrl);
    });
  });


// describe('createTransaction', () => {
// it('should call db.insert with proper arguments and return the inserted transaction', async () => {
// const mockData: any = {
// amount: 1000,
// transaction_type: 'credit',
// user_id: 1,
// reference: 'test_ref',
// };
// const mockInsertedTransaction = { ...mockData, id: 1 };
// mockDb.insert.mockResolvedValueOnce([1]);
// mockDb.first.mockResolvedValueOnce(mockInsertedTransaction);
// const result = await transactionService.createTransaction(mockData);
// expect(mockDb.insert).toHaveBeenCalledWith(mockData);
// expect(mockDb.first).toHaveBeenCalledWith('*');
// expect(mockDb.where).toHaveBeenCalledWith('id', 1);
// expect(result).toEqual(mockInsertedTransaction);
// });
// });

// describe('getById', () => {
// it('should call db.select with proper arguments and return the transaction', async () => {
// const mockTransaction = { id: 1, amount: 1000, transaction_type: 'credit', user_id: 1, reference: 'test_ref' };
// mockDb.select.mockResolvedValueOnce([mockTransaction]);
// const result = await transactionService.getById(1);
// expect(mockDb.select).toHaveBeenCalledWith('*');
// expect(mockDb.where).toHaveBeenCalledWith('id', 1);
// expect(result).toEqual(mockTransaction);
// });
// });
});

export {}; // to avoid TS redeclaration error in the test file.
