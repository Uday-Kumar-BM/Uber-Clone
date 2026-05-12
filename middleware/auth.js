import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorHandler } from './errorMiddleware.js';

const isAuthenticated = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findByPk(decoded.id, { attributes: { exclude: ['passwordHash'] } });

      if (!req.user) {
        return errorHandler(res, 401, 'Not authorized, user not found');
      }

      next();
    } catch (error) {
      console.error(error);
      if (error.name === 'TokenExpiredError') {
        return errorHandler(res, 401, 'Not authorized, token expired');
      }
      errorHandler(res, 401, 'Not authorized, token failed');
    }
  } else {
    errorHandler(res, 401, 'Not authorized, no token');
  }
};

const hasRole = (roles) => (req, res, next) => {
  if (!req.user) {
    return errorHandler(res, 401, 'Not authorized, user not logged in');
  }

  const userType = req.user.userType; // Assuming userType directly maps to roles

  if (!roles.includes(userType)) {
    return errorHandler(res, 403, `User role '${userType}' is not authorized to access this route. Required roles: ${roles.join(', ')}`);
  }

  next();
};

export { isAuthenticated, hasRole };
