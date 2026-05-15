export const createGrpcService = (processPayment) => ({
  ProcessPayment: async (call, callback) => {
    const { user_id, book_id } = call.request;

    const result = await processPayment.execute(user_id, book_id);

    callback(null, result);
  }
});