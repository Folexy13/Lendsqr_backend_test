import Joi from "joi"


const requiredNumberSchema = Joi.number().required();

export const fundWalletSchema = Joi.object({
    userId:requiredNumberSchema,
    amount:requiredNumberSchema,
});

export const transferFundSchema = Joi.object({
    senderId:requiredNumberSchema,
    receiverId:requiredNumberSchema,
    amount:requiredNumberSchema,
});
