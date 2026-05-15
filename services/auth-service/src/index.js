import dotenv from "dotenv";
dotenv.config();

import express from "express";

import { pool } from "./infrastructure/db.js";
import { RegisterUserUseCase } from "./usecases/registerUser.js";
import { LoginUserUseCase } from "./usecases/loginUser.js";
import { createAuthController } from "./adapters/rest/authController.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3007",
  })
);

app.use(express.json());

const registerUser = new RegisterUserUseCase(pool);
const loginUser = new LoginUserUseCase(pool);

const controller = createAuthController(registerUser, loginUser);

app.post("/auth/register", controller.register);
app.post("/auth/login", controller.login);

app.listen(process.env.PORT, () => {
  console.log("Auth running on", process.env.PORT);
});