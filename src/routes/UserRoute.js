import Controller from '../controllers/UserController';
import auth from '../middleware/auth.middleware'

export default (router) => {
    router.post(`/api/user/signup`, Controller.signup);
    router.post(`/api/user/login`, Controller.login);
};
