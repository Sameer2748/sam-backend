import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';


//credentials for the cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});

// fucntion to upload the local avatr and coverimage to cloudinary
const uploadOnCloudinary = async (localfilepath) => {
    try {
        if(!localfilepath) return null;
        // upload the files
        const response = await cloudinary.uploader.upload(localfilepath,{resource_type:"auto"});

        // uplaod succesfully
        fs.unlinkSync(localfilepath);
        return response;
    } catch (error) {
        // this remove the file in local storage
        fs.unlinkSync(localfilepath);
        return null;
    }
}

export {uploadOnCloudinary};