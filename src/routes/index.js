import express from 'express';
import userRoute from './UserRoute';
import incomeRoute from './IncomeRoute';
import expenseRoute from './ExpenseRoute'
const router = express.Router();

userRoute(router);
incomeRoute(router);
expenseRoute(router);

export default router;
