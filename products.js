import express from 'express'
import { create_product, product_update, product_details, product_all, product_delete } from '../../controller/Products/product.js'

const router = express.Router()

// Public Routes
router.post('/create', create_product)
router.get('/:productid', product_details)
router.get('/', product_all)
// Private routes
router.put('/:productid', product_update)
router.delete('/:productid', product_delete)
export default router