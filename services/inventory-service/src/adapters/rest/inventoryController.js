export const createInventoryController = (checkStock) => ({
  check: async (req, res) => {
    const result = await checkStock.execute(req.params.bookId);
    res.json(result);
  },
});