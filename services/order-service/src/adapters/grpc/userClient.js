import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const protoPath = path.resolve(__dirname, "../../../proto/user.proto");

const packageDef = protoLoader.loadSync(protoPath, {
  keepCase: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef);

// 🔥 ACCESO DIRECTO (SIN package intermedio)
const UserService = grpcObject.user?.UserService || grpcObject.UserService;

if (!UserService) {
  throw new Error("UserService not found in proto");
}

const client = new UserService(
  process.env.USER_SERVICE_URL,
  grpc.credentials.createInsecure()
);

export const userClient = {
  getUser: (id) =>
    new Promise((resolve, reject) => {
      client.GetUser({ id }, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    }),
};