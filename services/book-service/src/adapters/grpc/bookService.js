import grpc from "@grpc/grpc-js";

export const createGrpcService = (getBooksUseCase, getBookUseCase) => ({
  GetBook: async (call, callback) => {
    try {
      const book = await getBookUseCase.execute(call.request.id);

      if (!book) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: "Book not found",
        });
      }

      // 🔥 CLAVE: evitar array
      const b = Array.isArray(book) ? book[0] : book;

      callback(null, {
        id: String(b.id),
        title: b.title,
        author: b.author,
      });
    } catch (err) {
      callback(err);
    }
  },

  GetBooks: async (_, callback) => {
    try {
      const books = await getBooksUseCase.execute();

      callback(null, {
        books: books.map((b) => ({
          id: String(b.id),
          title: b.title,
          author: b.author,
        })),
      });
    } catch (err) {
      callback(err);
    }
  },
});