import Joi from "joi"


const requiredNumberSchema = Joi.number().required();
const requiredStringSchema = Joi.string().required();

export const fundWalletSchema = Joi.object({
    userId:requiredNumberSchema,
    amount:requiredNumberSchema,
});

export const transferFundSchema = Joi.object({
    senderId:requiredNumberSchema,
    receiverId:requiredNumberSchema,
    amount:requiredNumberSchema,
});

export const withdrawFundSchema = Joi.object({
    userId:requiredNumberSchema,
    amount:requiredNumberSchema,
    accountNumber:requiredNumberSchema,
    bankCode: requiredStringSchema,
    currency:requiredStringSchema
});


export const verifyWithdraw = Joi.object({
    otp: requiredNumberSchema,
    reference:requiredStringSchema
})