import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const protoPath = path.resolve(__dirname, "../../../proto/book.proto");

const packageDef = protoLoader.loadSync(protoPath, {
  keepCase: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef);

const BookService = grpcObject.book?.BookService || grpcObject.BookService;

if (!BookService) {
  throw new Error("BookService not found in proto");
}

const client = new BookService(
  process.env.BOOK_SERVICE_URL,
  grpc.credentials.createInsecure()
);

export const bookClient = {
  getBook: (id) =>
    new Promise((resolve, reject) => {
      client.GetBook({ id }, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    }),
};