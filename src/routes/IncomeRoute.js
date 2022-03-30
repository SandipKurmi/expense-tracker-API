import Controller from '../controllers/IncomeController';
import auth from '../middleware/auth.middleware'

export default (router) => {
  
    router.post(`/api/income`, auth,Controller.insertincome);
    router.get(`/api/income/`,auth, Controller.getincome);
    router.put(`/api/income/:id`,auth, Controller.updateincome);
    router.delete(`/api/income/:id`, auth,Controller.deleteincome);
};
