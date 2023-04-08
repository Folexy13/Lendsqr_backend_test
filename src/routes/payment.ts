import express from "express";
import { validateReqBody } from "../middleware";
import knex from "../database";
import { PaymentController } from "../controllers/paymentController";
import { fundWalletSchema, transferFundSchema, verifyWithdraw, withdrawFundSchema } from "../validations";


const paymentController = new PaymentController(knex);

const router = express.Router();
router.get("/", paymentController.getAllTransactions.bind(paymentController));
router.post("/fund", validateReqBody(fundWalletSchema), paymentController.pay.bind(paymentController));
router.post("/transfer", validateReqBody(transferFundSchema), paymentController.transfer.bind(paymentController));
router.post("/withdraw",validateReqBody(withdrawFundSchema), paymentController.withdraw.bind(paymentController));
router.post("/withdraw/verify",validateReqBody(verifyWithdraw), paymentController.verifyWithdraw.bind(paymentController));
router.get('/banks/:country',paymentController.getAllBanks.bind(paymentController))
router.post('/verify', paymentController.verify.bind(paymentController))




export default router;
