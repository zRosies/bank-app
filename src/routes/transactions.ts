import express from "express";
import {
  getAllTransactions,
  getTransactionsByUserId,
  postTransacations,
  updateTransaction,
} from "../controllers/transactions";
import { validate, validateTransaction } from "../utils/validator";
import { authentication } from "../controllers/authentication";

const route = express.Router();

route.post(
  "/",
  authentication,
  validateTransaction(),
  validate,
  postTransacations
);
route.get("/", authentication, getAllTransactions);
route.get("/:payer_id", getTransactionsByUserId);
route.put("/:transaction_id", authentication, updateTransaction);

export default route;
