import { ExportCustomJobPage } from 'twilio/lib/rest/bulkexports/v1/export/exportCustomJob';
import Service from './Service';
import bcrypt from 'bcrypt';
import { verify } from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();



class CategoryService extends Service {
    constructor(model) {
        super(model);
        this.insertcategory = this.insertcategory.bind(this);
        this.getcategory = this.getcategory.bind(this);

    }

    async insertcategory(a) {
        try {
            var data = new this.model({
                category: a.body.category,

            });
            await data.save()
            return {
                error: false,
                statusCode: 202,
                data: data,
            };
        } catch (err) {
            return {
                error: true,
                statusCode: 500,
                message: 'Not able to create item',
                errors: err,
            };
        }
    }
    async getcategory(a) {
        try {
            let userdata = await this.model.find({ "userid": a.userid })
            return {
                error: false,
                statusCode: 202,
                totaldata : userdata.length,
                data: userdata,
            };
        } catch (err) {
            return {
                error: true,
                statusCode: 500,
                message: 'cant find a catogory',
                errors: err,
            };
        }
    }
    
}

export default CategoryService;
