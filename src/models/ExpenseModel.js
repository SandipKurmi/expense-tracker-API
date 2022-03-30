import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

class ExpenseModel {
  // eslint-disable-next-line class-methods-use-this
  initSchema() {
    const schema = new Schema(
        {
            title: {
              required: [true, "Title  is required"],
              type: String,
            },
            type: {
              type: String,
              default: "expense",
            },
            description: {
              required: [true, "Description  is required"],
              type: String,
            },
            amount: {
              required: [true, "Amount is required"],
              type: Number,
            },
            userid: {
              type: String,
              required: [true, "User is required"],
            },
          },
          {
            timestamps: true,
          }
    );
    schema.plugin(uniqueValidator);
    mongoose.model('Expense', schema);
  }
  
  getInstance() {
    this.initSchema();
    return mongoose.model('Expense');
  }

  // eslint-disable-next-line class-methods-use-this
  getModel() {
    return mongoose.model('Expense');
  }
}

export default ExpenseModel;
