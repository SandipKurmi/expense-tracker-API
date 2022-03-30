import Controller from './Controller';
import Income from '../models/IncomeModel';
import IncomeService from '../services/IncomeService';

const incomeService = new IncomeService(new Income().getInstance());

class IncomeController extends Controller {
    constructor(service) {
        super(service);
        this.insertincome = this.insertincome.bind(this);
        this.getincome = this.getincome.bind(this);
        this.updateincome = this.updateincome.bind(this);
        this.deleteincome = this.deleteincome.bind(this);
    }

    //insert income
    async insertincome(req, res) {
        const data = {
            body: req.body,
            userid: req.user.userID
        }
        const response = await this.service.insertincome(data);
        if (response.error) return res.status(response.statusCode).send(response);
        return res.status(response.statusCode).send(response);
    }

    //get income
    async getincome(req, res) {
        const data = {
            userid: req.user.userID
        }
        const response = await this.service.getincome(data);
        if (response.error) return res.status(response.statusCode).send(response);
        return res.status(response.statusCode).send(response);
    }

    //update income
    async updateincome(req, res) {
        var incomeid = req.params.id
        var data = req.body
        var userid = req.user.userID
        const response = await this.service.updateincome(incomeid, data, userid);
        if (response.error) return res.status(response.statusCode).send(response);
        return res.status(response.statusCode).send(response);
    }

    //delete income
    async deleteincome(req, res) {
        const data = {
            body: req.body,
            userid: req.user.userID,
            incomeid: req.params.id
        }
        const response = await this.service.deleteincome(data);
        if (response.error) return res.status(response.statusCode).send(response);
        return res.status(response.statusCode).send(response);
    }
}



export default new IncomeController(incomeService);