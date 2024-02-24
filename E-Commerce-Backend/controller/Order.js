const { Order } = require("../model/Order");
exports.fetchOrdersByUser = async (req, res) => {
  const { id } = req.user;
  console.log("userid", id);
  try {
    const orders = await Order.find({ user: id });

    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.createOrder = async (req, res) => {
  const order = new Order(req.body);
  try {
    const doc = await order.save();
    console.log("doc", doc);
    res.status(201).json(doc);

    console.log("Order Placed Successfully");
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
};
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Order.findByIdAndDelete(id);

    res.status(201).json(doc);

    console.log("Order delete successfully from cart");
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to delete from Order" });
  }
};

exports.fetchAllOrders = async (req, res) => {
  //for admin he can see all users order
  let query = Order.find({ deleted: { $ne: true } });
  let totalOrdersQuery = Order.find({ deleted: { $ne: true } });
  if (req.query.category && req.query._order) {
    query = query.find({ category: req.query.category });
    totalOrdersQuery = totalOrdersQuery.find({
      category: req.query.category,
    });
  }
  if (req.query.brand && req.query._order) {
    query = query.find({ brand: req.query.brand });
    totalOrdersQuery = totalOrdersQuery.find({ brand: req.query.brand });
  }

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
    totalOrdersQuery = totalOrdersQuery.sort({
      [req.query._sort]: req.query._order,
    });
  }
  const totalDocs = await totalOrdersQuery.count().exec();
  console.log({ totalDocs });
  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};
