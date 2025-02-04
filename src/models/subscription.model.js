import mongoose, { Schema } from "mongoose";


const subscriptionSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId, // the one who is subscribing
        ref:User
    },
    channel:{
        type: Schema.Types.ObjectId, //the channel to whom the user us subsrcibing
        ref:User
    }

},{timestamps:true}
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export {Subscription};