import mongoose from "mongoose";

// ------------------------
// Define Schema
// --------------------------

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile_no:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
}, 
// { timestamps : true }
);
// --------------------------
// JWT TOKEN
// ---------------------------
// userSchema.method.getJWTToken = function() {
//     return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
//         expiresIn: '7d',
//     })
// } 



// -----------------------
// Define User Model
// -----------------------
const userModel = mongoose.model('user', userSchema)

export default userModel