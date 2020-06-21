import jwt from 'jsonwebtoken';
import logger from './logger';
import formatResponse from './formatResponse';

const SECRET_KEY = 'my secret';

export const generateToken = (user) => {
  const token = jwt.sign(user, SECRET_KEY, {
    expiresIn: 300,
  });

  return token;
};

export const verifyJWT = (req, res, next) => {
  let token = req.headers['authorization'];
  let response = formatResponse({
    message: [
      {
        message: 'Invalid token',
      },
    ],
  });
  let statusCode = 401;
  if (!token) return res.status(statusCode).json(response);

  if (token.split(' ')[0] !== 'Bearer')
    return res.status(statusCode).json(response);

  jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name == 'TokenExpiredError') {
        logger.debug('Token expired');
        response = formatResponse({
          message: [
            {
              message: 'Token expired',
            },
          ],
        });
      } else if (err.name == 'JsonWebTokenError') {
        logger.debug('Invalid token');
      } else {
        logger.error('Failed to decode token', err);

        response = formatResponse({
          message: [
            {
              message: 'Failed to authenticate token',
            },
          ],
        });
        statusCode = 500;
      }
      return res.status(statusCode).json(response);
    }

    logger.debug('Token is valid');

    req.user = decoded;
    next();
  });
};
