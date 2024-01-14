const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = mongoose.connect(process.env.MONGO_URI, {family:4});
        console.log(`MONGODB CONNECTED`); 
    } catch (error) {
        console.log(error.message);
    }
}

module.exports=connectDB;