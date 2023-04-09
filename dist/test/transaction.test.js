"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
const mockApi = {
    get: jest.fn(),
    post: jest.fn()
};
// Define a mock implementation of the Knex database driver
const mockDb = {};
// Create an instance of the TransactionService class with the mock objects
const transactionService = new services_1.TransactionService(mockDb);
transactionService.api = mockApi;
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
            await expect(action).toHaveLength(0);
        });
    });
});
