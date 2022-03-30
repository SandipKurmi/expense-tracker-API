// eslint-disable-next-line import/no-extraneous-dependencies
import { verify } from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export default (req, res, next) => {
  try {

    if (req.headers.authorization) {
      const token = req.headers.authorization
      // console.log('token',token);
      try {
        const decoded = verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        // console.log(req.user.userID)
        next();
      } catch (err) {
        res.status(403).send({
          error: true,
          statusCode: 403,
          message: 'Invalid Authorization token!',
        });
      }
    } else {
      res.status(401).send({
        error: true,
        statusCode: 401,
        message: 'Required Authorization token!',
      });
    }
  } catch (e) {
    res.status(401).send({
      error: true,
      statusCode: 401,
      message: 'Required Authorization token!',
    });
  }
};
