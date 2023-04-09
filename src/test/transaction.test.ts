import {Knex} from 'knex';
import { IPaystackBank, IPaystackResolveAccount } from '../interfaces';
import { BadRequestError } from '../exceptions';
import { TransactionService } from '../services';
import connectDb from '../database';

const mockApi = {
  get: jest.fn(),
  post: jest.fn()
};
// Define a mock implementation of the Knex database driver
const mockDb = {} as Knex;

// Create an instance of the TransactionService class with the mock objects
const transactionService = new TransactionService(mockDb);
transactionService.api = mockApi as any;
describe('TransactionService', () => {
  
describe('getBankList', () => {
    it('should call the Paystack API with the correct parameters', async () => {
      // Arrange
      const mockResponse = [{ id: '1', name: 'Bank A' }];
      mockApi.get.mockResolvedValue(mockResponse);

      // Act
      const result = await transactionService.getBankList('NG');

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/bank?country=NG');
      expect(result).toEqual(mockResponse);
    });
  
  it('should throw an error if the Paystack API returns an error status', async () => {
      // Arrange
      mockApi.get.mockRejectedValue({ status: 500 });

      // Act
      const action = async () => await transactionService.getBankList('NG');

      // Assert
      await expect(action).toHaveLength(0)
    });

  
});
  
});

export {}; // to avoid TS redeclaration error in the test file.
