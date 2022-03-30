import Controller from '../controllers/ExpenseController';
import auth from '../middleware/auth.middleware'

export default (router) => {
  
    router.post(`/api/expense`, auth,Controller.insertexpense);
    router.get(`/api/expense/`,auth, Controller.getexpense);
    router.put(`/api/expense/:id`,auth, Controller.updateexpense);
    router.delete(`/api/expense/:id`, auth,Controller.deleteexpense);
};
