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
        this.findbymonth = this.findbymonth.bind(this);
        this.searchDateWise = this.searchDateWise.bind(this);
        this.findbyYear = this.findbyYear.bind(this);
        
    }

    //insert income
    async insertincome(income, category) {
        const data = new this.model({
            title: income.body.title,
            description: income.body.description,
            amount: income.body.amount,
            date: income.body.date,
            categoryId: income.body.categoryId,
            type: "income",
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

            const incomeStats = await this.model.aggregate([
                //filter
                { $match: { amount: { $gte: 20 } } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
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
                // allData: data,
                allState: incomeStats,
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

    //get income by month
    async findbymonth(user, m) {
        try{
            const start = new Date();
            start.setMonth(m - 1, 1);
            start.setUTCHours(0, 0, 0, 0)    

            const data = await this.model.find({ date: start });
            
            let income = 0;
            for (var i = 0; i < data.length; i++) {
                income += data[i].amount;
            }
            if(income){
                return {
                    error: false,
                    statusCode: 202,
                    // incomeStats,
                    income,
                    TotalIncomeExpensePerDay: data
                    
                };
            }else{
                return {
                    error: true,
                    statusCode: 500,
                    message: 'Not User Found',
                };

            }
        } catch (err) {
            console.log(err)
            return {
                error: true,
                statusCode: 500,
                message: 'Not User Found',
                errors: err,
            };
        }

//////////////////////////////////////////////////////////

        // try {
        //     const income = await this.model.find({ "userid": user.userid });
        //     let month = date;
        //     let days = new Date(2022, month, 0).getDate()
        //     const start = new Date()
        //     start.setMonth(month - 1, 1);
        //     start.setUTCHours(0, 0, 0, 0)
        //     // start.setMonth(1);

        //     const end = new Date()
        //     end.setMonth(month - 1, days);
        //     end.setUTCHours(0, 0, 0, 0)

        //     // const data1 = await this.model.find({ date: start });
        //     // console.log(data1);

        //     // console.log(start);
        //     // console.log(end);
        //     const data = await this.model.aggregate([
        //         { $match: { date: { $gte: start, $lt: end } } },
        //         {
        //             $group: {
        //                 _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        //                 type: { $first: '$type' },
        //                 amount: { $sum: '$amount' },
        //                 totalRecords: { $sum: 1 },
        //             },
        //         },
        //     ]);
        //     // console.log(data)
        //     var arrDays = [];
        //     var arrAmount = [];
        //     for (let amount of data) {
        //         arrDays.push(amount._id);
        //         arrAmount.push(amount.amount);
        //     }

        //     console.log(arrDays);
        //     console.log(arrAmount);

        //     let arr = [];
        //     if (month < 10) {
        //         month = `0${month}`
        //     }
        //     var dayWiseData = [];
        //     for (let i = 0; i < days; i++) {
        //         var day = i + 1;
        //         if (day < 10) {
        //             day = `0${day}`
        //         }
        //         var strDate = `2022-${month}-${day}`
        //         //console.log(String(strDate))
        //         //console.log(arrDays.indexOf(strDate));
        //         if (arrDays.indexOf(strDate) > -1) {
        //             var index = arrDays.indexOf(strDate);
        //             var dayAmount = arrAmount[index]
        //             dayWiseData.push(dayAmount);
        //         } else {
        //             dayWiseData.push(0);
        //         }
        //     }
        //     // console.log(dayWiseData);

        //     return {
        //         error: false,
        //         statusCode: 200,
        //         data: data,
        //         // data1,
        //         // income: income,
        //         // arr,
        //     };
        // } catch (error) {
        //     console.log(error);
        //     return {
        //         error: true,
        //         statusCode: 500,
        //         message: 'Not User Found',
        //         errors: error,
        //     };
        // }
    }

    //get income by month and date
    async searchDateWise(userid, m, d) {
        try{
            const start = new Date();
            start.setMonth(m - 1, d);
            start.setUTCHours(0, 0, 0, 0)    

       
            const data = await this.model.find({ date: start });
            let income = 0;
            for (var i = 0; i < data.length; i++) {
                income += data[i].amount;
            }
            console.log(income)
            
            // const incomeStats = await this.model.aggregate([
            //     //filter
            //     { $match: { amount: { $gte: 20 } } },
            //     {
            //         $group: {
            //             _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            //             averageInc: { $avg: "$amount" },
            //             totalInc: { $sum: "$amount" },
            //             minInc: { $min: "$amount" },
            //             maxInc: { $max: "$amount" },
            //             type: { $first: '$type' },
            //             totalRecords: { $sum: 1 },
            //         },
            //     },
            // ]);
            return {
                error: false,
                statusCode: 202,
                // incomeStats,
                income,
                TotalIncomeExpensePerDay: data
                
            };
        } catch (err) {
            console.log(err)
            return {
                error: true,
                statusCode: 500,
                message: 'Not User Found',
                errors: err,
            };
        }
    }

    //find income by years
  async findbyYear(date){
    // console.log(date)
    try {
        let year = date;
        let final = [];
        for (let i = 1; i <= 12; i++) {
            let days = new Date(year, i, 0).getDate()
            console.log(days)
            const start = new Date()
            start.setMonth(i - 1, 1);
            start.setUTCHours(0, 0, 0)
            start.setUTCFullYear(year)

            const end = new Date()
            end.setMonth(i - 1, days);
            end.setUTCHours(0, 0, 0)
            end.setUTCFullYear(year)
            console.log(start)
            console.log(end);

            const data = await this.model.aggregate([
                { $match: { date: { $gte: start, $lt: end } } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
                        TransactionTotal: { $sum: 1 },
                    },
                },
            ]);
            console.log(data)
            final.push(...data);
        }
        console.log(final)
console.log(data)
        if (final.length == 0) {
            return {
                error: false,
                statusCode: 200,
                msg: `Data Not Found Of year ${year}`

            };
        } else {
            return {
                error: false,
                statusCode: 200,
                final,
            };
        }
    } catch (error) {
        console.log(error)
        return {
            error: true,
            statusCode: 500,
            message: 'Not able to get income',
        };
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
