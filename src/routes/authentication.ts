import express from "express";
import { jwtLogin } from "../controllers/authentication";

const route = express.Router();
route.post("/", jwtLogin);

export default route;
