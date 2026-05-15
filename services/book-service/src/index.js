import "./config/env.js";

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// Resolver rutas en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

// DEBUG
console.log("ENV PATH:", envPath);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);

// IMPORTS
import express from "express";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import { pool } from "./infrastructure/db.js";
import { PostgresBookRepository } from "./adapters/repository/postgresBookRepository.js";

import { GetBookUseCase } from "./usecases/getBook.js";
import { GetBooksUseCase } from "./usecases/getBooks.js";
import { CreateBookUseCase } from "./usecases/createBook.js";

import { createBookController } from "./adapters/rest/bookController.js";
import { createGrpcService } from "./adapters/grpc/bookService.js";

// APP
const app = express();
app.use(
  cors({
    origin: "http://localhost:3007",
  })
);

app.use(express.json());

// DI
const repo = new PostgresBookRepository(pool);

const createBookUseCase = new CreateBookUseCase(repo);
const getBookUseCase = new GetBookUseCase(repo);
const getBooksUseCase = new GetBooksUseCase(repo);

// CONTROLLER (ORDEN CORRECTO)
const controller = createBookController(
  createBookUseCase,
  getBooksUseCase,
  getBookUseCase
);

const create = controller.create;
const getAll = controller.getAll;
const getOne = controller.getOne;

// REST
app.post("/books", create);
app.get("/books", getAll);
app.get("/books/:id", getOne);

app.listen(process.env.PORT || 3000, () => {
  console.log("REST running on port", process.env.PORT || 3000);
});

// gRPC
const packageDef = protoLoader.loadSync("proto/book.proto");
const grpcObject = grpc.loadPackageDefinition(packageDef);

const server = new grpc.Server();

server.addService(
  grpcObject.book.BookService.service,
  createGrpcService(getBooksUseCase, getBookUseCase)
);

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("gRPC running on port 50051");
  }
);