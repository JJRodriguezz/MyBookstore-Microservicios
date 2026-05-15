import "./config/env.js";

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

import { pool } from "./infrastructure/db.js";
import { PostgresReviewRepository } from "./adapters/repository/postgresReviewRepository.js";
import { CreateReviewUseCase } from "./usecases/createReview.js";
import { GetReviewsUseCase } from "./usecases/getReviews.js";
import { createReviewController } from "./adapters/rest/reviewController.js";
import { createGrpcService } from "./adapters/grpc/reviewService.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3007",
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

const repo = new PostgresReviewRepository(pool);
const createReview = new CreateReviewUseCase(repo);
const getReviews = new GetReviewsUseCase(repo);

const controller = createReviewController(createReview, getReviews);

app.post("/reviews", controller.create);
app.get("/reviews/:bookId", controller.getByBook);

app.listen(process.env.PORT, () => {
  console.log("Review REST running on", process.env.PORT);
});

// gRPC
const protoPath = path.resolve(__dirname, "../proto/review.proto");

const packageDef = protoLoader.loadSync(protoPath, {
  keepCase: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef);

const ReviewService =
  grpcObject.review?.ReviewService || grpcObject.ReviewService;

const server = new grpc.Server();

server.addService(
  ReviewService.service,
  createGrpcService(getReviews)
);

server.bindAsync(
  "0.0.0.0:50056",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Review gRPC running on 50056");
  }
);