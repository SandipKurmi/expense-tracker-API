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
    async findbymonth(date) {
        try {
            let month = date;
            console.log(month);
            let days = new Date(2022, month, 0).getDate()
            const data = await this.model.aggregate([
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                        // title: { $first: '$title' },
                        amount : { $first: '$amount' },
                        // type: { $first: '$type' },
                        total: { $sum: 1 }
                    },
                },
            ]);

            console.log(data)
            //empty array
            var arrDays = [];
            var arrAmount = [];
            var arrTotal = [];

            for (let amount of data) {
                arrDays.push(amount._id);
                arrAmount.push(amount.amount);
                arrTotal.push(amount.total);

            }
            // console.log(arrDays);
            // console.log(arrAmount);
            ///cc
            var dayWiseData = [];
            var dayTotalData = [];
            if (month < 10) {
                month = `0${month}`
            }
            for (let i = 0; i < days; i++) {
                var day = i + 1;
                if (day < 10) {
                    day = `0${day}`
                }
                var strDate = `2022-${month}-${day}`
                // console.log(String(strDate))
                // console.log(arrDays.indexOf(strDate));
                if (arrDays.indexOf(strDate) > -1) {
                    var index = arrDays.indexOf(strDate);
                    var dayAmount = arrAmount[index]
                    var dayTotal = arrTotal[index]
                    dayWiseData.push(dayAmount);
                    dayTotalData.push(dayTotal);
                } else {
                    dayTotalData.push(0)
                    dayWiseData.push(0);
                }
            }
            // console.log(dayWiseData);
            // console.log(dayTotalData)

            //generate empty data
            let finaldata = [];
            if (month < 10) {
                month = `${month}`
            }
            for (let i = 0; i < days; i++) {
                var day = i + 1;
                if (day < 10) {
                    day = `0${day}`
                }
                var strDate = `2022-${month}-${day}`
                console.log(String(strDate))
                let obj = {
                    _id: strDate,
                    TotalAmout: dayWiseData[i],
                    TotalTranctions: dayTotalData[i]
                }
                finaldata.push(obj);
            }
            console.log(finaldata)
            return {
                error: false,
                statusCode: 200,
                finaldata,
            };
        }
        catch (err) {
            console.log(err)
            return {
                error: true,
                statusCode: 500,
                message: 'Not able to get income',
                errors: err,
            };
        }

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
            const data = await this.model.aggregate([
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
                        TransactionTotal: { $sum: 1 },
                    },
                },
            ]);
            final.push(...data);
        // console.log(final)
        //create empty array
        var arrDays = [];
        var arrPrice = [];
        for (let price of final) {
            arrDays.push(price._id);
            arrPrice.push(price.TransactionTotal);
        }
        // console.log(arrDays);
        // console.log(arrPrice);
        let arr = [];
        var dayWiseData = [];
        for (let i = 0; i < 12; i++) {
            var month = i + 1;
            if (month < 10) {
                month = `0${month}`
            }
            var strDate = `${year}-${month}`
            // console.log(String(strDate))
            // console.log(arrDays.indexOf(strDate));
            if (arrDays.indexOf(strDate) > -1) {
                var index = arrDays.indexOf(strDate);
                var dayPrice = arrPrice[index]
                dayWiseData.push(dayPrice);
            } else {
                dayWiseData.push(0);
            }
        }
        //generate blank data
        let empty = [];
        for (let i = 1; i <= 12; i++) {
            // let days = new Date(year, i, 0).getDate()
            const start = new Date()
            start.setMonth(i - 1, 1);
            start.setUTCHours(0, 0, 0)
            start.setUTCFullYear(year)
            if (i < 10) {
                i = `0${i}`
            }
            let date = `${start.getFullYear()}-${i} `
            let obj = {
                _id: date,
                TransactionTotal: dayWiseData[i - 1],
            }
            empty.push(obj);
        }
        // console.log(empty)
        //return
        return {
            error: false,
            statusCode: 200,
            msg: `Data Of year ${year}`,
            empty
        };
    }
    catch (error) {
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
