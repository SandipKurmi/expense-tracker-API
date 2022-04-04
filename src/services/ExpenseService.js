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
        this.findbymonth = this.findbymonth.bind(this);
        this.searchDateWise = this.searchDateWise.bind(this);
        this.findbyYear = this.findbyYear.bind(this);
    }

    //insert expense
    async insertexpense(exp) {
        const Expense = new this.model({
            title: exp.body.title,
            description: exp.body.description,
            amount: exp.body.amount,
            date: exp.body.date,
            categoryId: exp.body.categoryId,
            type: "expense",
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

    //get expense
    async getexpense(exp) {

        try {
            const Expense = await this.model.find({ "userid": exp.userid });

            const expensesStats = await this.model.aggregate([
                //filter
                { $match: { amount: { $gte: 20 } } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                        averageExp: { $avg: "$amount" },
                        totalExp: { $sum: "$amount" },
                        minExp: { $min: "$amount" },
                        maxExp: { $max: "$amount" },
                        totalRecords: { $sum: 1 },
                    },
                },
            ]);
            return {
                error: false,
                statusCode: 202,
                allStats: expensesStats,
                data: Expense,

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

    //get expense by month
    async findbymonth(m) {
        try {
            const start = new Date();
            start.setMonth(m - 1, 1);
            start.setUTCHours(0, 0, 0, 0)

            const data = await this.model.find({ date: start });

            let income = 0;
            for (var i = 0; i < data.length; i++) {
                income += data[i].amount;
            }
            // console.log(income)
            if (income) {
                return {
                    error: false,
                    statusCode: 202,
                    income,
                    TotalIncomeExpensePerDay: data

                };
            } else {
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

    //get expense by month and date
    async searchDateWise(userid, m, d) {
        try {
            const start = new Date();
            start.setMonth(m - 1, d);
            start.setUTCHours(0, 0, 0, 0)


            const data = await this.model.find({ date: start });
            let income = 0;
            for (var i = 0; i < data.length; i++) {
                income += data[i].amount;
            }
            // console.log(income)
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

    // find expense by year
    async findbyYear(date) {
        try {
            const start = new Date()
            start.setMonth(0, 1);
            start.setUTCHours(0, 0, 0)
            start.setUTCFullYear(date)

            const end = new Date()
            end.setMonth(11, 31);
            end.setUTCHours(0, 0, 0)
            end.setUTCFullYear(date)

            // console.log(start, end)
            const data = await this.model.aggregate([
                { $match: { date: { $gte: start, $lt: end } } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                        title: { $first: '$title' },
                        price: { $first: '$amount' },
                        type: { $first: '$type' },
                        total: { $sum: 1 }
                    },
                },
            ]);
            console.log(data)
            console.log('year data end')

            if (data.length!=0){
                return{
                    error: false,
                    statusCode:200,
                    data:data
                    
                }
            }else{
                return {
                    error: true,
                    statusCode: 500,
                    message: 'this year not found',
                };
            }

        } catch (error) {
            console.log(err)
            return {
                error: true,
                statusCode: 500,
                message: 'Not User Found',
                errors: err,
            };

        }
    }


    
    // // get expense by year
    // async findbyYear(date) {
    //     try {
    //         let year = date;
    //         let final = [];
    //         for (let i = 1; i <= 12; i++) {
    //             console.log(data);
    //             let days = new Date(year, i, 0).getDate()
    //             const start = new Date()
    //             start.setMonth(i - 1, 1);
    //             start.setUTCHours(0, 0, 0)
    //             start.setUTCFullYear(year)

    //             const end = new Date()
    //             end.setMonth(i - 1, days);
    //             end.setUTCHours(0, 0, 0)
    //             end.setUTCFullYear(year)

    //             console.log(start);
    //             console.log(end)

    //             const data = await this.model.aggregate([
    //                 { $match: { date: { $gte: start, $lt: end } } },
    //                 console.log(date),
    //                 {
    //                     $group: {
    //                         _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
    //                         type: { $first: '$type' },
    //                         amount: { $sum: '$amount' },
    //                         TransactionTotal: { $sum: 1 },
    //                     },
    //                 },
    //             ]);
    //             console.log(data);
    //             final.push(data);

    //         }
    //         console.log(final)

    //         //generate blcank data
    //         let empty = [];
    //         for (let i = 1; i <= 12; i++) {
    //             // let days = new Date(year, i, 0).getDate()
    //             const start = new Date()
    //             start.setMonth(i - 1, 1);
    //             start.setUTCHours(0, 0, 0)
    //             start.setUTCFullYear(year)
    //             if (i < 10) {
    //                 i = `0${i}`
    //             }
    //             let date = `${start.getFullYear()}-${i} `
    //             let obj = {
    //                 _id: date,
    //                 TransactionTotal: 0,
    //             }
    //             // console.log(obj)
    //             empty.push(obj);

    //         }
    //         console.log(empty)
    //         if (final.length == 0) {
    //             return {
    //                 error: false,
    //                 statusCode: 200,
    //                 msg: `Data Not Found Of year ${year}`,
    //                 empty

    //             };
    //         } else {
    //             return {
    //                 error: false,
    //                 statusCode: 200,
    //                 final,
    //             };
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         return {
    //             error: true,
    //             statusCode: 500,
    //             message: 'Not able to get expense',
    //         };
    //     }
    // }


    //update expense
    async updateexpense(expenseid, data, userid) {
        try {
            let Expense = await this.model.findOne({ "userid": userid })
            if (Expense) {
                // console.log(income)
                const updateExpense = await this.model.updateOne({ _id: expenseid }, data);
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

    //delete expense
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
