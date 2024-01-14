const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const PostSchema = new Schema({
  title:{type:String},
  summary:{type:String},
});

const PostModel = model('Post', PostSchema);

module.exports = PostModel;