const { Cart } = require("../model/Cart");
exports.fetchCartByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const cartItems = await Cart.find({ user: id })
      .populate("user")
      .populate("product");
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.addToCart = async (req, res) => {
  const { id } = req.user;
  const cart = new Cart({ ...req.body, user: id });
  try {
    const doc = await cart.save();
    const result = await doc.populate("product");
    res.status(201).json(result);

    console.log("Product saved successfully in cart");
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to save in cart" });
  }
};
exports.deleteFromCart = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Cart.findByIdAndDelete(id);

    res.status(201).json(doc);

    console.log("Product delete successfully from cart");
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to delete from cart" });
  }
};
exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, { new: true });
    const result = await cart.populate("product");
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
