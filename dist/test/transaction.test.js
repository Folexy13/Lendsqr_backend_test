"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("../exceptions");
const services_1 = require("../services");
const database_1 = __importDefault(require("../database"));
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
    let transactionService;
    beforeEach(() => {
        transactionService = new services_1.TransactionService(database_1.default);
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
            const mockResponse = [
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
            await expect(transactionService.getBankList(mockQuery)).rejects.toThrowError(new exceptions_1.BadRequestError('An error occurred with our third party. Please try again at a later time.'));
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
