import dotenv from 'dotenv';
import connectDB from './db/index.js';

const port = process.env.PORT || 3000;

dotenv.config();

connectDB();



/*
// Connect to MongoDB
(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`);
        console.log(`Connected to MongoDB ${db_name}`);

        app.listen(port, ()=>{
            console.log("listening on port " + port);
        });
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
})();

*/
