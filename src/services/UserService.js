import Service from './Service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();


class UserService extends Service {
    constructor(model) {
        super(model);
        this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);
    }
    //signup user account
    async signup(item) {
        try {
            const hash = await bcrypt.hashSync(item.password, 10);
            item.password = hash;
            const data = await this.model.create(item);
            return {
                error: false,
                statusCode: 202,
                data: data,
            };
        } catch (err) {
            return {
                error: true,
                statusCode: 501,
                message: 'Error in Signup',
                errors: err.errors,
            };
        }
    }
    
    //login user account
    async login(item) {
        try {
            let checkemail = await this.model.findOne({ "email": item.email })
            if (checkemail) {
                var checkPassword = await bcrypt.compareSync(item.password, checkemail.password);
                if (checkPassword) {  
                    const token = jwt.sign({ userID: checkemail._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
                    return {
                        error: false,
                        statusCode: 200,
                        data: checkemail,
                        token: token,
                    };
                } else {
                    return {
                        error: true,
                        statusCode: 401,
                        error: 'wrong Email Or Password'
                    };
                }
            } else {
                return {
                    error: true,
                    statusCode: 401,
                    error: 'not found email!'
                };

            }
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                message: 'server error'
            };
        }
    }
  
}


export default UserService;
