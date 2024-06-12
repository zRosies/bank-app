import express from "express";
import transaction from "./transactions";
import account from "./accounts";
import balance from "./balance";
import swagger from "./swagger";
import authRoute from "./authentication";

// Minain router
const router = express.Router();
router.use("/api/transactions", transaction);
router.use("/api/accounts", account);
router.use("/api/balance", balance);
router.use("/swagger", swagger);
router.use("/authentication", authRoute);

export default router;
