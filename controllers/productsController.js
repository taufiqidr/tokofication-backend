const Product = require('../models/Product')

// @desc Get all products 
// @route GET /products
// @access Private
const getAllProducts = async (req, res) => {
    const products = await Product.findAll();
    // If no products 
    if (!products?.length) {
        return res.status(400).json({ message: 'No products found' })
    }
    res.json(products)
}

// @desc Create new product
// @route POST /products
// @access Private
const createNewProduct = async (req, res) => {
    const { product_name, stock_count, price } = req.body

    if (!product_name || !stock_count || !price) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const ProductObject = {
        product_name, stock_count, price
    }

    const product = await Product.create(ProductObject);
    if (product) { //created 
        res.status(201).json({ message: `New product ${product_name} created` })
    } else {
        res.status(400).json({ message: 'Invalid product data received' })
    }
}

// @desc Update a product
// @route PATCH /products
// @access Private
const updateProduct = async (req, res) => {
    const { id, product_name, stock_count, price } = req.body

    // Confirm data 
    if (!id) {
        return res.status(400).json({ message: 'ID field are required' })
    }
    // Does the product exist to update?
    const product = await Product.findOne({ where: { id: id } })

    if (!product) {
        return res.status(400).json({ message: 'Product not found' })
    }

    if (product_name) product.product_name = product_name
    if (stock_count) product.stock_count = stock_count
    if (price) product.price = price

    const updatedProduct = await product.save()

    res.json({ message: `${updatedProduct.product_name} updated` })

}

// @desc Delete a product
// @route DELETE /products
// @access Private
const deleteProduct = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    const product = await Product.findOne({ where: { id: id } })

    if (!product) {
        return res.status(400).json({ message: 'Product not found' })
    }

    await product.destroy()

    res.json({ message: 'Product deleted' })
}

module.exports = {
    getAllProducts,
    createNewProduct,
    updateProduct,
    deleteProduct
}