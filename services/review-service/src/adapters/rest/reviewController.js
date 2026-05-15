export const createReviewController = (createReview, getReviews) => ({
  create: async (req, res) => {
    const { bookId, userId, content } = req.body;
    const review = await createReview.execute(bookId, userId, content);
    res.json(review);
  },

  getByBook: async (req, res) => {
    const reviews = await getReviews.execute(req.params.bookId);
    res.json(reviews);
  },
});