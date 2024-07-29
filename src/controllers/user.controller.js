import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const generateAccessAndRefereshTokens = async(userId)=>{
    try {
        const user = await User.findById(userId);
        console.log(user);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        console.log("after creating token");

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return {accessToken, refreshToken};

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler( async(req,res)=>{
    // get details
    const {fullname, email, username, password } = req.body

    // validations
    if([fullname, email, username, password].some((field)=> field?.trim() === "" )){
        throw new ApiError(400, "all fields are required")
    }
    // check if already in database
    const userExist = await User.findOne({$or:[{username}, {email}]});
    if(userExist){
        throw new ApiError(409, "username or email already exists")
    }

    // handle avatar and cover image using multer middleware and cloudinary
    const avatarlocalpath = req.files?.avatar[0]?.path;
    // const coverimagelocalpath = req.files?.coverImage[0]?.path;
    if(!avatarlocalpath ){
        throw new ApiError(400, "avatar is required");
    }
    
    let coverimagelocalpath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files?.coverImage.length >0){
        coverimagelocalpath = req.files.coverImage[0].path;
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
    const createduser = await User.findById(user._id).select("-password -refreshToken")
    if(!createduser){
        throw new ApiError(500, "failed to create user");
    }


    return res.status(201).json(new ApiResponse(200, createduser,"user registered succesfully"))

})

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})


const refreshAccessToken = asyncHandler(async(req, res)=>{
    const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingrefreshToken){
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = await jwt.verify(incomingrefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id);
        if(!user){
            throw new ApiError(401, "Invalid refresh token");
        }
    
        if(incomingrefreshToken !== user?.refreshToken){
            throw new ApiError(401, "refresh token is expired or used");
        }
    
        const options={
            httpOnly: true,
            secure: true
        }
        const {accessToken, newrefreshToken} = await generateAccessAndRefereshTokens(user._id);
    
        return res.status(200).cookie("accessToken", accessToken)
        .cookie("refreshToken", newrefreshToken, options).json(new ApiResponse(200, {accessToken, refreshToken:newrefreshToken}, ""));
    
    } catch (error) {
        throw new ApiError(401,error.message || "Invalid refresh Token");
    }
})

export {registerUser, loginUser, logoutUser, refreshAccessToken};