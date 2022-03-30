import Service from './Service';
import dotenv from "dotenv";
dotenv.config();

class IncomeService extends Service {
    constructor(model) {
        super(model);
        this.insertincome = this.insertincome.bind(this);
        this.getincome = this.getincome.bind(this);
        this.updateincome = this.updateincome.bind(this);
        this.deleteincome = this.deleteincome.bind(this);
    }

    //insert income
    async insertincome(income) {
        // console.log( cat.userid)
        const data = new this.model({
            // postid:req.body.postid,
            title: income.body.title,
            description:income.body.description,
            amount:income.body.amount,
            userid: income.userid
        })
        try {
            const savedIncome = await data.save();
            return ({
                error: false,
                statusCode: 200,
                data: savedIncome,
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
    async getincome(incid) {
        try {
            const income = await this.model.find({ "userid": incid.userid });
            // console.log(income)
            var total = 0;
            for (var i = 0; i < income.length; i++) {
                total = total + income[i].amount;
            }
            return {
                error: false,
                statusCode: 202,
                TotalIncome: total,
                data: income
            };
        } catch (error) {
            return ({
                error: true,
                statusCode: 500,
                data: error,
                msg: "can't find income"
            });
        }
    }

    //update income
    async updateincome(incomeid, data, userid) {
        try {
            let income = await this.model.findOne({ "userid": userid })
            if (income) {
                console.log(income)
                const updatedIncome = await this.model.updateOne({ _id: incomeid },  data );
                console.log(updatedIncome)
                return {
                    error: false,
                    deleted: true,
                    statusCode: 200,
                    message: 'income update successfullly!',
                    data: updatedIncome
                };
            } else {
                return {
                    error: true,
                    statusCode: 404,
                    message: 'income not found',
                };
            }
        } catch (err) {
            console.log(err)
            return {
                error: true,
                statusCode: 500,
                message: 'income not found',
                errors: err,
            };
        }
    }

    //delete income
    async deleteincome(item) {
        try {
            let income = await this.model.find({ "userid": item.userid })
            if (income) {
                let incomeid = await this.model.findByIdAndDelete(item.incomeid)
                if (incomeid) {
                    return {
                        error: false,
                        deleted: true,
                        statusCode: 200,
                        message: 'income deleted !',
                    };
                } else {
                    return {
                        error: true,
                        statusCode: 404,
                        message: 'income not found',
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

export default IncomeService;
