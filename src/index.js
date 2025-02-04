import dotenv from 'dotenv';
import connectDB from './db/index.js';
import app from './app.js';

const port =  3001;

dotenv.config({path:'./.env'});

connectDB().then(()=>{
    app.on('error',(err)=>{
        console.log(err);
    })
    app.listen(port, ()=>{
        console.log("listening on port " + port);
    });
}).catch((err) => {console.log("mongo db error connection", error);})



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
