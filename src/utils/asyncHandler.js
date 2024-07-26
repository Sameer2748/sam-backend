// fucntion for promise return 
const asyncHandler= (requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch(err=>next(err));
    }
}

// higher order fucntions with try catch
// const asyncHandler = (fn)=> async(req,res, next)=>{
//     try {
//         await fn(req,res,next);
//     } catch (error) {
//         res.status(err.code || 500).json({success: false, error: error.message})
//     }
// }


export {asyncHandler}