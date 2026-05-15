export const createGrpcService = (getOrders, getOrder) => ({
  GetOrders: async (_, callback) => {
    const orders = await getOrders.execute();
    callback(null, { orders });
  },

  GetOrder: async (call, callback) => {
    const order = await getOrder.execute(call.request.id);
    callback(null, order);
  },
});