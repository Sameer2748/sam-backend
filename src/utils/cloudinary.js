import {v2 as cloudinary} from './cloudinary';
import fs from './fs';

// R-zQL3bvvSW3h1QEc7kFtk4j4hQ

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});


const uploadOnCloudinary = async (localfilepath) => {
    try {
        if(!localfilepath) return null;
        // upload the files
        const response = await cloudinary.uploader.upload(localfilepath,{resource_type:"auto"});

        // uplaod succesfully
        console.log("succesfully uploaded files", response.url);
        return response;
    } catch (error) {
        // this remove the file in local storage
        fs.unlinkSync(localfilepath);
        return null;
    }
}

export {uploadOnCloudinary};