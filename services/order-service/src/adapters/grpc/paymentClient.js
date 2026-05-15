import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ruta al proto
const protoPath = path.resolve(__dirname, "../../../proto/payment.proto");

const packageDef = protoLoader.loadSync(protoPath, {
  keepCase: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef);

// obtener servicio
const PaymentService =
  grpcObject.payment?.PaymentService || grpcObject.PaymentService;

if (!PaymentService) {
  throw new Error("PaymentService not found");
}

// crear cliente
const client = new PaymentService(
  process.env.PAYMENT_SERVICE_URL,
  grpc.credentials.createInsecure()
);

// exportar funciones
export const paymentClient = {
  processPayment: (user_id, book_id) =>
    new Promise((resolve, reject) => {
      client.ProcessPayment({ user_id, book_id }, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    }),
};