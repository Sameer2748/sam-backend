import mongoose from 'mongoose';
import { db_name } from '../constant.js';

const connectDB = async()=>{
    const url = `${process.env.MONGODB_URI}/${db_name}`;
    console.log(url);
    try {
        const connection = await mongoose.connect(url);

        console.log(connection.connection.host);
        
    } catch (error) {
        console.log("Mongodb connection failed",error.message);
    }
};
export default connectDB;