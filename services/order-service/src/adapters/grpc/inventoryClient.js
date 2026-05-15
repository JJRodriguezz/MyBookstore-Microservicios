import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const protoPath = path.resolve(__dirname, "../../../proto/inventory.proto");

const packageDef = protoLoader.loadSync(protoPath, {
  keepCase: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef);

const InventoryService =
  grpcObject.inventory?.InventoryService || grpcObject.InventoryService;

if (!InventoryService) {
  throw new Error("InventoryService not found");
}

const client = new InventoryService(
  process.env.INVENTORY_SERVICE_URL,
  grpc.credentials.createInsecure()
);

export const inventoryClient = {
  checkStock: (book_id) =>
    new Promise((resolve, reject) => {
      client.CheckStock(
        { book_id },
        { deadline: Date.now() + 2000 }, // 2 segundos
        (err, res) => {
            if (err) return reject(err);
            resolve(res);
        }
        );
    }),

  decreaseStock: (book_id) =>
    new Promise((resolve, reject) => {
      client.DecreaseStock({ book_id }, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    }),
};

