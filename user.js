import userModel from "../../model/User/users.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
// import transporter from "../../config/emailConfig.js";


// ---------------------------
// Register and Signup User
// ----------------------------
export const RegisterUser = async (req, res) =>{
    const hashPassword = await bcrypt.hash(req.body.password, 10)
    const { name, email, password, mobile_no, username } = req.body
    const user = await userModel(
        {
            name: name,
            email: email,
            password: hashPassword,
            mobile_no: mobile_no,
            username: username
        }
    )
    try {
        const saveUser = await user.save()
        const saved_user = await userModel.findOne({ email:email })
        // Generate JWT Token
        const token = jwt.sign({ userID:saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn:'5d' })
        // console.log("----", user.save);
        res.status(201).json({ "message":user, token:token })
        // if (password) {
        //     const password = await bcrypt.hash 
        // }
    } catch (error) {
        res.status(500).json({ "message":"Something went wrong" });
    }
}


// ------------------------------
// LogIn User and SignIn User
// -------------------------------
export const logIn = async(req, res) =>{
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email:email })
        // Genrate JWT Token
        const token = jwt.sign({ userID:user._id }, process.env.JWT_SECRET_KEY, { expiresIn:'7d' })
        // console.log(result)
        const matchPassword = await bcrypt.compare(password, user.password)
        // console.log('-----', matchPassword)
        if (user.email == email && matchPassword){
            res.status(201).json({user, "token":token })
        } else {
            res.status(401).json({"message": "Email or Password is not Valid"})
        }
    } catch (error) {
        res.status(500).json({ "message":"you are not Registered user" })
    }
}

// -------------------------
// Update User
// -------------------------
export const user_update = async(req, res) =>{
    const userID = req.params.id
    // console.log('-----userid', userID)
    const updateData = req.body
    const { password } = updateData
    if (password !== undefined ) {
    const hashPass = await bcrypt.hash(password,  10)
    updateData.password = hashPass
    await userModel.findByIdAndUpdate(req.user._id, {$set:{password:hashPass}})
        
    }
    // console.log('check-------)
    
    try {
        const user = await userModel.findByIdAndUpdate(userID, updateData, {new:true}).lean()
        res.status(200).json(user)
        console.log(req.user._id)
    } catch (error) {
        res.status(500).json(error.message)
    }
}

// --------------------------
// Sign-Out and Log-Out User
// ---------------------------
export const logOut = async(req, res)=>{
    res.cookie("token", null, {
        expires:new Date(Date.now()),
        httpOnly: true,
    })
    res.status(200).json({
        success: true,
        message:"Logged Out"
    })
}



// --------------------------------
// Get all Users
// --------------------------------
export const all_user = async(req, res) =>{
    try {
        const user = await userModel.find().select('-password')
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json(error)
    }
}

// --------------------------
// Reset Password
// ---------------------------
export const PasswordResetEmail = async(req, res)=> {
    const {email} = req.body
    if(email){
        const user = await userModel.findOne({email:email})
        if (user) {
            const secret = user._id + process.env.JWT_SECRET_KEY
            const token = jwt.sign({ userID: user._id }, secret, {expiresIn: '2d'})
            const link = `http://localhost:3000/api/user/reset/${user._id}/${token}`
            console.log(link)
            // Send Email
            // let info = await transporter.sendMail({
            //     from:process.env.EMAIL_FROM,
            //     to: user.email,
            //     subject: "GeekShop - Password Reset Link",
            //     html:`<a href=${link}>Click Here</a> to reset your Password`
            // })
            res.send({ "status":"success", "message":"Password Reset Email Sent.... Please Check Your Email" })
        }else{
            res.send({ "status":"failed", "message": "Email doesn't exists" })
        }
    }else{
        res.send({ "status":"failed", "message":"Email Field is required" })
    }
}

// --------------------------
// User Password Reset
// --------------------------
export const userPassReset = async(req, res)=>{
    const {password} = req.body
    const {id, token} = req.params
    const user = await userModel.findById(id)
    const newSeceret = user._id + process.env.JWT_SECRET_KEY
    try {
        jwt.verify(token, newSeceret)
        if (password) {
            const newHashPass = await bcrypt.hash(password, 10)
            await userModel.findByIdAndUpdate(user._id, {$set:{password:newHashPass}})
            res.send({ "status":"success", "message":"Password Reset Successfully" })
        }else{
            res.send({ "stauts": "failed", "message":"All fields are required" })
        }
    } catch (error) {
        console.log(error)
        res.send({ "status":"failed", "message":"Invalid Token" })
    }
}