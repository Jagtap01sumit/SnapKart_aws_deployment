const { Category } = require('../model/Category');
exports.fetchCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).exec();
        res.status(200).json(categories);

    }
    catch (err) {
        res.status(400).json(err);
    }
}
exports.createCategory = async (req, res) => {
    const category = new Category(req.body);
    try {
        const doc = await category.save();

        res.status(201).json(doc);

        console.log("product saved successfully");
    } catch (error) {

        console.error(error);
        res.status(400).json({ error: "Failed to create the product" });
    }
};