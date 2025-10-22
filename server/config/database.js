const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://Sanjeevi555pn:Sanjeevi@cluster0.vq9y9.mongodb.net/turf");
        console.log('MongoDB connected successfully');
        
        const connection = mongoose.connection;
        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });
        
        connection.on('error', (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running ' + err);
            process.exit();
        });
    } catch (error) {
        console.log('Something went wrong!');
        console.log(error);
    }
};

module.exports = connectDB;
