import { NextFunction, RequestHandler, Response, Request } from "express";
import JWT from "jsonwebtoken";
import { UnauthorizedError } from "../exceptions";
import { TOKEN_SECRET, } from "../config";
import axios from "axios";

export interface ProtectedRequest extends Request {
  user?: any;
}

export default function (): RequestHandler {
  return async (
    req: ProtectedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { authorization } = req.headers;

      if (!authorization)
        throw new UnauthorizedError(`No authorization headers passed`);

      const bearer = authorization.split(" ")[0];
      const token = authorization.split(" ")[1];

      if (!bearer || !token)
        throw new UnauthorizedError(
          `Token not passed in authorization headers`
        );

      if (bearer !== "Bearer")
        throw new UnauthorizedError(
          `Bearer not passed in authorization headers`
        );

      const decoded: any = JWT.verify(token, String(TOKEN_SECRET));

      // if (decoded.accountType === "user") {
      //   const userReq = await axios.get(
      //     `${USER_SERVICE_URL}/${decoded.id}`
      //   );
      //   req.user = userReq.data.data;
      // } else throw new UnauthorizedError();
      next();
    } catch (err: any) {
      next(err);
    }
  };
}
