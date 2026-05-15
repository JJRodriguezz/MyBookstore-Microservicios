export const createGrpcService = (getReviews) => ({
  GetReviewsByBook: async (call, callback) => {
    const reviews = await getReviews.execute(call.request.book_id);
    callback(null, { reviews });
  },
});