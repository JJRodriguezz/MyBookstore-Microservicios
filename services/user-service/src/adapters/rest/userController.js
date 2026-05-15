export const createUserController = (createUser, getUsers, getUser) => ({
  create: async (req, res) => {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: "name and email are required" });
      }

      const result = await createUser.execute(name, email);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const result = await getUsers.execute();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const result = await getUser.execute(req.params.id);

      if (!result) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
});