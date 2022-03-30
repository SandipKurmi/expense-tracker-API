import Service from './Service';
import dotenv from "dotenv";
dotenv.config();

class ExpenseService extends Service {
    constructor(model) {
        super(model);
        this.insertexpense = this.insertexpense.bind(this);
        this.getexpense = this.getexpense.bind(this);
        this.updateexpense = this.updateexpense.bind(this);
        this.deleteexpense = this.deleteexpense.bind(this);
    }

    //insert income
    async insertexpense(exp) {
        // console.log( cat.userid)
        const Expense = new this.model({
            // postid:req.body.postid,
            title: exp.body.title,
            description:exp.body.description,
            amount:exp.body.amount,
            userid: exp.userid
        })
        try {
            const saveExpense = await Expense.save();
            return ({
                error: false,
                statusCode: 200,
                data: saveExpense,
            });
        } catch (err) {
            return ({
                error: true,
                statusCode: 500,
                data: err,

            });
        }
    }
    //get income
    async getexpense(exp) {
        try {
            const Expense = await this.model.find({ "userid": exp.userid });
            // console.log(income)
            var total = 0;
            for (var i = 0; i < Expense.length; i++) {
                total = total + Expense[i].amount;
            }

            
            return {
                error: false,
                statusCode: 202,
                TotalExpense: total,
                data: Expense
            };
        } catch (error) {
            return ({
                error: true,
                statusCode: 500,
                data: error,
                msg: "can't find Expense"
            });
        }
    }

    //update income
    async updateexpense(expenseid, data, userid) {
        try {
            let Expense = await this.model.findOne({ "userid": userid })
            if (Expense) {
                // console.log(income)
                const updateExpense = await this.model.updateOne({ _id: expenseid },  data );
                // console.log(updateExpense)
                return {
                    error: false,
                    deleted: true,
                    statusCode: 200,
                    message: 'expense update successfullly!',
                    data: updateExpense
                };
            } else {
                return {
                    error: true,
                    statusCode: 404,
                    message: 'expense not found',
                };
            }
        } catch (err) {
            console.log(err)
            return {
                error: true,
                statusCode: 500,
                message: 'expense not found',
                errors: err,
            };
        }
    }

    //delete income
    async deleteexpense(item) {
        try {
            let Expense = await this.model.find({ "userid": item.userid })
            // console.log(Expense)
            if (Expense) {
                let expid = await this.model.findByIdAndDelete(item.expid)
                if (expid) {
                    return {
                        error: false,
                        deleted: true,
                        statusCode: 200,
                        message: 'expense deleted !',
                    };
                } else {
                    return {
                        error: true,
                        statusCode: 404,
                        message: 'expense not found',
                    };
                }

            }
        } catch (err) {
            console.log(err)
            return {
                error: true,
                statusCode: 500,
                message: 'Error 500',
                errors: err,
            };
        }
    }
}

export default ExpenseService;
