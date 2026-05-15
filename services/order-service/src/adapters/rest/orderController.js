export const createOrderController = (createOrder, getOrders, getOrder) => ({
  createOrder: async (req, res) => {
    try {
      const { userId, bookId } = req.body;
      const result = await createOrder.execute(userId, bookId);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  getAll: async (req, res) => {
    const result = await getOrders.execute();
    res.json(result);
  },

  getOne: async (req, res) => {
    const result = await getOrder.execute(req.params.id);
    res.json(result);
  },
});