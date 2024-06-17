import express from "express";
import AccountController from "../controllers/accounts";
import { validate, validateAccount } from "../utils/validator";
import { authentication } from "../controllers/authentication";

const route = express.Router();
const accounts = new AccountController();

route.post(
  "/",
  authentication,
  validateAccount(),
  validate,
  accounts.createAccount
);
route.get("/", accounts.getAllAccounts);
route.get("/:user_id", accounts.getAllAccountById);
route.put("/:user_id", authentication, accounts.updateAccount);
route.delete("/:user_id", authentication, accounts.deleteAccount);

export default route;
