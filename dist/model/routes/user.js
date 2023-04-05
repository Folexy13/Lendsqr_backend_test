"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../../middleware");
const validations_1 = require("../../validations");
const userController_1 = require("../../controllers/userController");
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = new userController_1.UserController();
const router = express_1.default.Router();
router
    .route("/")
    .get(getAllUsers);
router.post('/register', (0, middleware_1.validateReqBody)(validations_1.CreateUserSchema), createUser);
// router.post('/login', validateReqBody(loginReqBodySchema), loginNewUser);
router.route('/:id')
    .get((0, middleware_1.validateJwt)(), getUserById)
    .put((0, middleware_1.validateJwt)(), updateUser)
    .delete((0, middleware_1.validateJwt)(), deleteUser);
exports.default = router;
