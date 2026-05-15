import "./config/env.js";

import express from "express";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

import { pool } from "./infrastructure/db.js";
import { PostgresInventoryRepository } from "./adapters/repository/postgresInventoryRepository.js";
import { CheckStockUseCase } from "./usecases/checkStock.js";
import { DecreaseStockUseCase } from "./usecases/decreaseStock.js";
import { createInventoryController } from "./adapters/rest/inventoryController.js";
import { createGrpcService } from "./adapters/grpc/inventoryService.js";
import cors from "cors";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(
  cors({
    origin: "http://localhost:3007",
  })
);

// DI
const repo = new PostgresInventoryRepository(pool);
const checkStock = new CheckStockUseCase(repo);
const decreaseStock = new DecreaseStockUseCase(repo);

// REST
const controller = createInventoryController(checkStock);

app.get("/inventory/:bookId", controller.check);

app.listen(process.env.PORT, () => {
  console.log("Inventory REST running on", process.env.PORT);
});

// gRPC
const protoPath = path.resolve(__dirname, "../proto/inventory.proto");

const packageDef = protoLoader.loadSync(protoPath, {
  keepCase: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef);

const server = new grpc.Server();

server.addService(
  grpcObject.inventory.InventoryService.service,
  createGrpcService(checkStock, decreaseStock)
);

server.bindAsync(
  "0.0.0.0:50054",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Inventory gRPC running on 50054");
  }
);