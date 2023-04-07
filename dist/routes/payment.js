"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const database_1 = __importDefault(require("../database"));
const paymentController_1 = require("../controllers/paymentController");
const validations_1 = require("../validations");
const paymentController = new paymentController_1.PaymentController(database_1.default);
const router = express_1.default.Router();
router.get("/", paymentController.getAllTransactions.bind(paymentController));
router.post("/fund", (0, middleware_1.validateReqBody)(validations_1.fundWalletSchema), paymentController.pay.bind(paymentController));
router.post("/transfer", (0, middleware_1.validateReqBody)(validations_1.transferFundSchema), paymentController.transfer.bind(paymentController));
router.post("/withdraw", paymentController.withdraw.bind(paymentController));
router.get('/verify/:reference', paymentController.verify.bind(paymentController));
exports.default = router;
