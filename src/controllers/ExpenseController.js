import Controller from './Controller';
import Expense from '../models/ExpenseModel';
import ExpenseService from '../services/ExpenseService';

const expenseService = new ExpenseService(new Expense().getInstance());

class ExpenseController extends Controller {
    constructor(service) {
        super(service);
        this.insertexpense = this.insertexpense.bind(this);
        this.getexpense = this.getexpense.bind(this);
        this.updateexpense = this.updateexpense.bind(this);
        this.deleteexpense = this.deleteexpense.bind(this);
    }

    //insert expense
    async insertexpense(req, res) {
        const data = {
            body: req.body,
            userid: req.user.userID
        }
        const response = await this.service.insertexpense(data);
        if (response.error) return res.status(response.statusCode).send(response);
        return res.status(response.statusCode).send(response);
    }

    //get expense
    async getexpense(req, res) {
        const data = {
            userid: req.user.userID
        }
        const response = await this.service.getexpense(data);
        if (response.error) return res.status(response.statusCode).send(response);
        return res.status(response.statusCode).send(response);
    }

    //update expense
    async updateexpense(req, res) {
        var expenseid = req.params.id
        var data = req.body
        var userid = req.user.userID
        const response = await this.service.updateexpense(expenseid, data, userid);
        if (response.error) return res.status(response.statusCode).send(response);
        return res.status(response.statusCode).send(response);
    }

    //delete expense
    async deleteexpense(req, res) {
        const data = {
            body: req.body,
            userid: req.user.userID,
            expid: req.params.id
        }
        const response = await this.service.deleteexpense(data);
        if (response.error) return res.status(response.statusCode).send(response);
        return res.status(response.statusCode).send(response);
    }
}

export default new ExpenseController(expenseService);
