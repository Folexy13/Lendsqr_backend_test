import express from "express";
import { validateReqBody } from "../middleware";
import knex from "../database";
import { PaymentController } from "../controllers/paymentController";
import { fundWalletSchema, transferFundSchema } from "../validations";


const paymentController = new PaymentController(knex);

const router = express.Router();
router.get("/", paymentController.getAllTransactions.bind(paymentController));
router.post("/fund", validateReqBody(fundWalletSchema), paymentController.pay.bind(paymentController));
router.post("/transfer", validateReqBody(transferFundSchema), paymentController.transfer.bind(paymentController));
router.post("/withdraw", paymentController.withdraw.bind(paymentController));
router.get('/verify/:reference', paymentController.verify.bind(paymentController))



export default router;
