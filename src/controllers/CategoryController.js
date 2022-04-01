import Controller from './Controller';
import Category from '../models/CategoryModel';
import CategoryService from '../services/CategoryService';

const categoryService = new CategoryService(new Category().getInstance());

class CategoryController extends Controller {
    constructor(service) {
        super(service);
        this.insertcategory = this.insertcategory.bind(this);
        this.getcategory = this.getcategory.bind(this);
    }

    async insertcategory(req, res) {
        const data = {
            body: req.body,
        }
        const response = await this.service.insertcategory(data);
        if (response.error) return res.status(response.statusCode).send(response);
        return res.status(response.statusCode).send(response);
    }

    //curd
    async getcategory(req, res) {
        const data = {
            userid: req.user.userID
        }
        const response = await this.service.getcategory(data);
        if (response.error) return res.status(response.statusCode).send(response);
        return res.status(response.statusCode).send(response);
    }

}



export default new CategoryController(categoryService);
