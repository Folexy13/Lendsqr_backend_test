"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const exceptions_1 = require("../exceptions");
const config_1 = require("../config");
function default_1() {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers;
            if (!authorization)
                throw new exceptions_1.UnauthorizedError(`No authorization headers passed`);
            const bearer = authorization.split(" ")[0];
            const token = authorization.split(" ")[1];
            if (!bearer || !token)
                throw new exceptions_1.UnauthorizedError(`Token not passed in authorization headers`);
            if (bearer !== "Bearer")
                throw new exceptions_1.UnauthorizedError(`Bearer not passed in authorization headers`);
            const decoded = jsonwebtoken_1.default.verify(token, String(config_1.TOKEN_SECRET));
            // if (decoded.accountType === "user") {
            //   const userReq = await axios.get(
            //     `${USER_SERVICE_URL}/${decoded.id}`
            //   );
            //   req.user = userReq.data.data;
            // } else throw new UnauthorizedError();
            next();
        }
        catch (err) {
            next(err);
        }
    };
}
exports.default = default_1;
