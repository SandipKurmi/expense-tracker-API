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
            description: income.body.description,
            amount: income.body.amount,
            date: income.body.date,
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
    async getincome(inc) {
        try {

            const income = await this.model.find({ "userid": inc.userid });

            // const incomeStats = await this.model.aggregate([
            //     //filter
            //     { $match: { amount: { $gte: 20 } } },
            //     {
            //         $group: {
            //             _id: null,
            //             averageInc: { $avg: "$amount" },
            //             totalInc: { $sum: "$amount" },
            //             minInc: { $min: "$amount" },
            //             maxInc: { $max: "$amount" },
            //             totalRecords: { $sum: 1 },
            //         },
            //     },
            // ]);

            // var start = new Date();
            // start.setUTCHours(0, 0, 0, 0);

            // var end = new Date();
            // end.setUTCHours(23, 59, 59, 999);
            // console.log(start);
            // console.log(end);

            // let month = date;
            // let days = new Date(2022, month, 0).getDate()
            // const start = new Date()
            // start.setMonth(month - 1, 1);
            // start.setUTCHours(0,0,0)

            // const end = new Date()
            // end.setMonth(month - 1, days);
            // end.setUTCHours(0,0,0)

            var startDate = new Date("2021-08-04");
            var endDate = new Date("2024-08-12");
            let data = await this.model.aggregate([
                  { $match: { date: { $gte: startDate, $lt: endDate } } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                          title: { $first: '$title' },
                        averageInc: { $avg: "$amount" },
                        totalInc: { $sum: "$amount" },
                        minInc: { $min: "$amount" },
                        maxInc: { $max: "$amount" },
                        totalRecords: { $sum: 1 },
                    },
                },
            ]);

            return {
                error: false,
                statusCode: 202,
                allData: data,
                // allState: incomeStats,
                data: income
            };
        } catch (error) {
            console.log(error)
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
                const updatedIncome = await this.model.updateOne({ _id: incomeid }, data);
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
