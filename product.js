import productModel from "../../model/Products/product.js";

// ----------------------
// Create a products
// ----------------------
export const create_product = async(req, res)=>{
    const { title, price, color, storage, operating_system } = req.body
    const product = await productModel(
        {
            title: title,
            price: price,
            storage: storage,
            color: color,
            operating_system: operating_system
        }
    )

    try {
        const savedProduct = await product.save()
        res.status(201).json(product)
    } catch (error) {
        res.status(400).json(error.message)
    }
}

// ---------------------------
// Update Product
// ----------------------------
export const product_update = async(req, res) =>{
    try {
        const product = {
            title: req.body.title,
            price: req.body.price,
            color: req.body.color,
            storage: req.body.storage,
            operating_system: req.body.operating_system
        }
        const updatedProduct =  await productModel.findByIdAndUpdate({ _id: req.params.productid }, product)
        res.status(201).json(product)
    } catch (error) {
        res.status(401).json(error.message)
    }
}

// --------------------------
// Single Product
// --------------------------
export const product_details = async(req, res)=>{
    try {
        const product = await productModel.findById(req.params.productid)
        res.status(201).json(product)
    } catch (error) {
        res.status(401).json(error.message)
    }
}

// ------------------------
// Get all Products
// -------------------------
export const product_all = async(req, res)=> {
    try {
        const product = await productModel.find()
        res.status(201).json(product)
    } catch (error) {
        res.status(401).json(error.message)
    }
}

// ------------------------------
// Delete Product
// --------------------------
export const product_delete = async(req, res)=>{
    try {
        const removeProduct = await productModel.findByIdAndDelete(req.params.productid)
        res.status(201).json("Product Deleted")
    } catch (error) {
        res.status(401).json(error.message)
    }
}