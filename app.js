import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db/connectdb.js'
import userrouter from './routes/User/user.js'
import productrouter from './routes/Product/products.js'
import cookieParser from 'cookie-parser'
const app = express()

dotenv.config()
// ----------------------
// env config
// ------------------------
const PORT = process.env.PORT || 5000
const DATABASE_URL = process.env.DATABASE_URL

//--------------------------------
// Database Connect
// -------------------------------- 
connectDB(DATABASE_URL)

// -----------------------
//JSON configuration 
// ------------------------
app.use(express.json())
app.use(cookieParser())



// -------------------------
// Load Routes
// -------------------------

// user routes
app.use('/api', userrouter)


// Product Routes
app.use('/api/product', productrouter)

// ----------------------------
// App listening
// ----------------------------
app.listen(PORT, (req, res)=>{
    console.log(`Server is running`);
})