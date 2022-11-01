const Category = require('../models/Category')

// @desc Get all categories 
// @route GET /categories
// @access Private
const getAllCategories = async (req, res) => {
    const categories = await Category.findAll();
    // If no categories 
    if (!categories?.length) {
        return res.status(400).json({ message: 'No categories found' })
    }
    res.json(categories)
}

// @desc Create new category
// @route POST /categories
// @access Private
const createNewCategory = async (req, res) => {
    const { category_name } = req.body

    if (!category_name) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const CategoryObject = {
        category_name
    }

    const category = await Category.create(CategoryObject);
    if (category) { //created 
        res.status(201).json({ message: `New category ${category_name} created` })
    } else {
        res.status(400).json({ message: 'Invalid category data received' })
    }
}

// @desc Update a category
// @route PATCH /categories
// @access Private
const updateCategory = async (req, res) => {
    const { id, category_name, stock_count, price } = req.body

    // Confirm data 
    if (!id) {
        return res.status(400).json({ message: 'ID field are required' })
    }
    // Does the category exist to update?
    const category = await Category.findOne({ where: { id: id } })

    if (!category) {
        return res.status(400).json({ message: 'Category not found' })
    }

    if (category_name) category.category_name = category_name

    const updatedCategory = await category.save()

    res.json({ message: `${updatedCategory.category_name} updated` })

}

// @desc Delete a category
// @route DELETE /categories
// @access Private
const deleteCategory = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    const category = await Category.findOne({ where: { id: id } })

    if (!category) {
        return res.status(400).json({ message: 'Category not found' })
    }

    await category.destroy()

    res.json({ message: 'Category deleted' })
}

module.exports = {
    getAllCategories,
    createNewCategory,
    updateCategory,
    deleteCategory
}