import grpc from "@grpc/grpc-js";

export const createGrpcService = (getUserUseCase, getUsersUseCase) => ({
  GetUser: async (call, callback) => {
    try {
      const user = await getUserUseCase.execute(call.request.id);

      if (!user) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: "User not found",
        });
      }

      // 🔥 CLAVE: evitar array
      const u = Array.isArray(user) ? user[0] : user;

      callback(null, {
        id: String(u.id),
        name: u.name,
        email: u.email,
      });
    } catch (err) {
      callback(err);
    }
  },

  GetUsers: async (_, callback) => {
    try {
      const users = await getUsersUseCase.execute();

      callback(null, {
        users: users.map((u) => ({
          id: String(u.id),
          name: u.name,
          email: u.email,
        })),
      });
    } catch (err) {
      callback(err);
    }
  },
});