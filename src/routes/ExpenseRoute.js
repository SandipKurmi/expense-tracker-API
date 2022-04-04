import Controller from '../controllers/ExpenseController';
import auth from '../middleware/auth.middleware'

export default (router) => {
    router.get(`/api/expense/month/find/:m`, auth,Controller.findbymonth);
    router.get(`/api/expense/year/find/:y`, auth,Controller.findbyYear);
    router.post(`/api/expense`, auth,Controller.insertexpense);
    router.get(`/api/expense/`,auth, Controller.getexpense);
    router.put(`/api/expense/:id`,auth, Controller.updateexpense);
    router.delete(`/api/expense/:id`, auth,Controller.deleteexpense);
    router.get(`/api/expense/date/:m/:d`, auth, Controller.searchDateWise);
   

};
