import Joi from "joi"


const requiredStringSchema = Joi.string().required();
const requiredNumberSchema = Joi.number().required();

export const CreateUserSchema = Joi.object({
    name:requiredStringSchema,
    password:requiredStringSchema,
    email:requiredStringSchema,
});

export const loginReqBodySchema = Joi.object({
    password:requiredStringSchema,
    email:requiredStringSchema,
})
