import express from "express";
import { validateReqBody, validateJwt } from "../middleware";
import knex from "../database";
import { PaymentController } from "../controllers/paymentController";
import { fundWalletSchema, transferFundSchema } from "../validations";


const paymentController = new PaymentController(knex);

const router = express.Router();

router.post("/fund", validateReqBody(fundWalletSchema), paymentController.fund.bind(paymentController));
router.post("/transfer", validateReqBody(transferFundSchema), paymentController.transfer.bind(paymentController));
router.post("/withdraw", validateReqBody(fundWalletSchema), paymentController.withdraw.bind(paymentController));


export default router;
