import "./config/env.js";

import express from "express";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import { pool } from "./infrastructure/db.js";
import { PostgresOrderRepository } from "./adapters/repository/postgresOrderRepository.js";

import { CreateOrderUseCase } from "./usecases/createOrder.js";
import { GetOrdersUseCase } from "./usecases/getOrders.js";
import { GetOrderUseCase } from "./usecases/getOrder.js";

import { createOrderController } from "./adapters/rest/orderController.js";
import { createGrpcService } from "./adapters/grpc/orderService.js";

import { userClient } from "./adapters/grpc/userClient.js";
import { bookClient } from "./adapters/grpc/bookClient.js";
import { inventoryClient } from "./adapters/grpc/inventoryClient.js";
import { paymentClient } from "./adapters/grpc/paymentClient.js";

import { authMiddleware } from "./middleware/authMiddleware.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3007",
  })
);

app.use(express.json());

// Repository
const repo = new PostgresOrderRepository(pool);

// Use cases
const createOrder = new CreateOrderUseCase(
  repo,
  userClient,
  bookClient,
  inventoryClient,
  paymentClient
);
const getOrders = new GetOrdersUseCase(repo);
const getOrder = new GetOrderUseCase(repo);

// Controller
const controller = createOrderController(createOrder, getOrders, getOrder);

// 🔥 DEBUG CLAVE (puedes quitar luego)
console.log("controller:", controller);

// REST
app.post("/orders", authMiddleware, controller.createOrder);
app.get("/orders", controller.getAll);
app.get("/orders/:id", controller.getOne);

app.listen(process.env.PORT || 3002, () => {
  console.log("Order REST running on", process.env.PORT || 3002);

  console.log("JWT_SECRET:", process.env.JWT_SECRET);
});

// ===== gRPC =====
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const protoPath = path.resolve(__dirname, "../proto/order.proto");

const packageDef = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef);

const server = new grpc.Server();

server.addService(
  grpcObject.order.OrderService.service,
  createGrpcService(getOrders, getOrder)
);

server.bindAsync(
  "0.0.0.0:50053",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Order gRPC running on 50053");
  }
);