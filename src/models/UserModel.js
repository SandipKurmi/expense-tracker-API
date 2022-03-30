import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

class UserModel {
  initSchema() {
    const schema = new Schema(
      {
        name: {
          type: String,
          default: null,
        },
        email: {
          type: String,
          default: null,
        },
        password: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        } 
      },
      {
        // timestamps: true,
      },
    );
    schema.plugin(uniqueValidator);
    mongoose.model('User', schema);
  }

  getInstance() {
    this.initSchema();
    return mongoose.model('User');
  }

  getModel() {
    return mongoose.model('User');
  }
}

export default UserModel;
