import mongoose, {Schema} from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        trin:true,
        index:true
    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref:'Video'
        }
    ],
    password:{
        type:String,
        required:[true, 'password is required'],
    },
    refreshToken:{
        type:String
    }
},{timestamps:true});

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);

    next();
})

// create method for checking the new oassword by user and return boolean value
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.method.generateAccessToken = async function(){
    return await jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    }, 
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}
userSchema.method.generateRefreshToken = async function(){
    return await jwt.sign({
        _id:this._id,
    }, 
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_SECRET
    })
}
export const User = mongoose.model('User', userSchema);