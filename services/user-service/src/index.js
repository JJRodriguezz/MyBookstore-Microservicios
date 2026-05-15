import "./config/env.js";

import express from "express";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import { pool } from "./infrastructure/db.js";
import { PostgresUserRepository } from "./adapters/repository/postgresUserRepository.js";

import { GetUserUseCase } from "./usecases/getUser.js";
import { GetUsersUseCase } from "./usecases/getUsers.js";
import { CreateUserUseCase } from "./usecases/createUser.js";

import { createUserController } from "./adapters/rest/userController.js";
import { createGrpcService } from "./adapters/grpc/userService.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3007",
  })
);

app.use(express.json());

// DI
const repo = new PostgresUserRepository(pool);

const createUserUseCase = new CreateUserUseCase(repo);
const getUserUseCase = new GetUserUseCase(repo);
const getUsersUseCase = new GetUsersUseCase(repo);

// 🔥 ORDEN CORRECTO
const controller = createUserController(
  createUserUseCase,
  getUsersUseCase,
  getUserUseCase
);

// REST
app.post("/users", controller.create);
app.get("/users", controller.getAll);
app.get("/users/:id", controller.getOne);

app.listen(process.env.PORT || 3001, () => {
  console.log("User REST running on", process.env.PORT || 3001);
});

// gRPC
const packageDef = protoLoader.loadSync("proto/user.proto");
const grpcObject = grpc.loadPackageDefinition(packageDef);

const server = new grpc.Server();

server.addService(
  grpcObject.user.UserService.service,
  createGrpcService(getUsersUseCase, getUserUseCase)
);

server.bindAsync(
  "0.0.0.0:50052",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("User gRPC running on 50052");
  }
);