import express from 'express';
import userRoute from './UserRoute';
import incomeRoute from './IncomeRoute';
import expenseRoute from './ExpenseRoute'
import categoryRoute from './CategoryRoute'
const router = express.Router();

userRoute(router);
incomeRoute(router);
expenseRoute(router);
categoryRoute(router);

export default router;
