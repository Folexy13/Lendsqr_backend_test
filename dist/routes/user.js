"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const validations_1 = require("../validations");
const userController_1 = require("../controllers/userController");
const database_1 = __importDefault(require("../database"));
const userController = new userController_1.UserController(database_1.default);
const router = express_1.default.Router();
router
    .route("/")
    .get(userController.getAllUsers.bind(userController));
router.post('/register', (0, middleware_1.validateReqBody)(validations_1.CreateUserSchema), userController.createUser.bind(userController));
router.post('/login', (0, middleware_1.validateReqBody)(validations_1.loginReqBodySchema), userController.loginUser.bind(userController));
router.route('/:id')
    .put(userController.updateUser.bind(userController))
    .delete(userController.deleteUser.bind(userController))
    .get(userController.getUserById.bind(userController));
exports.default = router;
