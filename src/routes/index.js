
import express from 'express';
import userRoute from './UserRoute';
import categoryRoute from './CategoryRoute';
import blogRoute from './BlogRoute';


const router = express.Router();


userRoute(router);
categoryRoute(router)
blogRoute(router)


export default router;
