import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

class IncomeModel {
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
        },
        categoryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Category',
          required: true
          
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
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        date:{
          type: Date,
        }
       
      },
      {
        timestamps: true,
      }
    );
    schema.plugin(uniqueValidator);
    mongoose.model('Income', schema);
  }

  getInstance() {
    this.initSchema();
    return mongoose.model('Income');
  }

  // eslint-disable-next-line class-methods-use-this
  getModel() {
    return mongoose.model('Income');
  }
}

export default IncomeModel;
