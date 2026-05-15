export const createAuthController = (registerUser, loginUser) => ({
  register: async (req, res) => {
    try {
      const { email, password, name } = req.body;
      const user = await registerUser.execute(name, email, password);
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await loginUser.execute(email, password);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
});