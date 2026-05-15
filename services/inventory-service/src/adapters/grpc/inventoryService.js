export const createGrpcService = (checkStock, decreaseStock) => ({
  CheckStock: async (call, callback) => {
    const result = await checkStock.execute(call.request.book_id);
    callback(null, result);
  },

  DecreaseStock: async (call, callback) => {
    const result = await decreaseStock.execute(call.request.book_id);
    callback(null, result);
  },
});