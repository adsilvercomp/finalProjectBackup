const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const ObjectId = Schema.Types.ObjectId;

const grocerylistSchema = new Schema({
//   user: {
//       type: ObjectId,
//       ref: "User" // <- whatever the name of your User model is
//   },
    food: {type: String, required: true},
    purchased: {type: Boolean, default: false},
    use: {type: Boolean, default: false}
  
})

const grocerylist = mongoose.model('GroceryList', grocerylistSchema);
module.exports = grocerylist;