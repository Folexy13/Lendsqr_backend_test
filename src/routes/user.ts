import express from "express";
import { validateReqBody, validateJwt } from "../middleware";
import { CreateUserSchema, loginReqBodySchema} from "../validations";
import { UserController } from "../controllers/userController";
import knex from "../database";




const userController = new UserController(knex);

const router = express.Router();

router
  .route("/")
  .get(userController.getAllUsers.bind(userController))
  
router.post('/register', validateReqBody(CreateUserSchema), userController.createUser.bind(userController));
// router.post('/login', validateReqBody(loginReqBodySchema), loginNewUser);

// router.route('/:id')
//   .get(validateJwt(), getUserById)
//   .put(validateJwt(),updateUser)
  // .delete(validateJwt(), deleteUser)
export default router;
