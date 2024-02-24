import { asyncHandler } from "./asyncHandler.js";
import { User } from "../models/userSchema.js";
import Errorhandler from "./error.js";
import jwt from "jsonwebtoken"

//AUTHENTICATION
export const isAuthenticated = asyncHandler(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
      return next(new Errorhandler("User is not authenticated!", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
    req.user = await User.findById(decoded.id);
  
    next();
});

// AUTHORISATION

export const isAuthorized = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new Errorhandler(
            `User with this role(${req.user.role}) not allowed to access this resource`
          )
        );
      }
      next();
    };
};
