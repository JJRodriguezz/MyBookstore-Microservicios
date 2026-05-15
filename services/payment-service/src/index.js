import "./config/env.js";

import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

import { ProcessPaymentUseCase } from "./usecases/processPayment.js";
import { createGrpcService } from "./adapters/grpc/paymentService.js";

import express from "express";
import cors from "cors";


const app = express();

app.use(
  cors({
    origin: "http://localhost:3007",
  })
);

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const protoPath = path.resolve(__dirname, "../proto/payment.proto");

const packageDef = protoLoader.loadSync(protoPath, {
  keepCase: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef);

const PaymentService =
  grpcObject.payment?.PaymentService || grpcObject.PaymentService;

const server = new grpc.Server();

const processPayment = new ProcessPaymentUseCase();

server.addService(
  PaymentService.service,
  createGrpcService(processPayment)
);

server.bindAsync(
  "0.0.0.0:50055",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Payment gRPC running on 50055");
  }
);