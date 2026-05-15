export const createBookController = (createBook, getBooks, getBook) => ({
  create: async (req, res) => {
    try {
      const { title, author } = req.body;

      if (!title || !author) {
        return res.status(400).json({ error: "title and author are required" });
      }

      const result = await createBook.execute(title, author);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const result = await getBooks.execute();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const result = await getBook.execute(req.params.id);

      if (!result) {
        return res.status(404).json({ error: "Book not found" });
      }

      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
});