import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

class CategoryModel {
  initSchema() {
    const schema = new Schema(
      {
        category: {
          type: String,
        },
      }
    );
    schema.plugin(uniqueValidator);
    mongoose.model('Category', schema);
  }
  
  getInstance() {
    this.initSchema();
    return mongoose.model('Category');
  }

  getModel() {
    return mongoose.model('Category');
  }
}

export default CategoryModel;
