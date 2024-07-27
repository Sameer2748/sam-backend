import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const port =  3002;

const app = express();

app.use(cors({origin:process.env.CORS_ORIGIN, credentials:true}));
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true, limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());


//routes import
import userRouter from "./routes/user.routes.js";
//routes
app.use("/api/v1/user", userRouter);


app.listen(port, ()=>{
    console.log("Server running on port " + port);
});

export default app;