import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async(req,res)=>{
    // get details
    const {username, email, fullname, password} = req.body;
    console.log(username, email, fullname, password);

    // validations
    if([fullname, email, username, password].some((field)=> field?.trim() === "" )){
        throw new ApiError(400, "all fields are required")
    }
    // check if already in database
    const userExist = await User.findOne({$or:[{username}, {email}]});
    if(userExist){
        throw new ApiError(409, "username or email already exists")
    }

    // encrypt password

    // handle avatar and cover image using multer middleware and cloudinary
    console.log(req.files);
    const avatarlocalpath = req.files?.avatar[0]?.path;
    const coverimagelocalpath = req.files?.coverimage[0]?.path;
    if(!avatarlocalpath ){
        throw new ApiError(400, "avatar is required");
    }

    //upload to cloudinary which return the reponse then we get url form it
    const avatar = await uploadOnCloudinary(avatarlocalpath);
    const coverImage = await uploadOnCloudinary(coverimagelocalpath);
    if(!avatar){
        throw new ApiError(500, "failed to upload avatar to cloudinary");
    }
    // create user object create entry in db
    const user = await User.create({fullname, avatar:avatar.url, coverImage:coverImage?.url || "",email, password, username: username.toLowerCase() })

    //remove password and refreshtoken
    const createduser = await User.create(user._id).select("-password -refreshToken")
    if(!createduser){
        throw new ApiError(500, "failed to create user");
    }

    //return res

    return res.status(201).json(new ApiResponse(200, createduser,"user registered succesfully"))

    res.send("done")
})

export {registerUser};