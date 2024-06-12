import jwt from "jsonwebtoken";
import cookie from "cookie";
import { NextFunction, Response, Request } from "express";
import { Account, User } from "./schema";
import { getDb } from "../connection/connection";
import bcrypt from "bcryptjs";

// ---------------- Giving a token to the user here -------------------
export async function jwtLogin(
  req: Request,
  res: Response,
  next: NextFunction,
  retry: number = 3
) {
  const user: User = req.body;

  const existingUser = (await getDb()
    .db("picpay")
    .collection("user_account")
    .findOne({ email: user.email })) as Account | null;

  // --------- Checking if the  passwords match before givng the token --------
  const mathPassword: boolean = await bcrypt.compare(
    user.password,
    `${existingUser?.password}`
  );
  if (!mathPassword) {
    if (retry > 0) {
      // Using recursion after 5s to retry the connection
      console.log("Retrying to connect..." + retry);
      setTimeout(() => {
        jwtLogin(req, res, next, (retry -= 1));
      }, 5000);
      return;
    }
    return res
      .status(401)
      .json({ message: "Unauthorized. Email or password is incorrect" });
  }

  // ----------- Giving the user a token and storing it in the cookie -------
  const accessToken = jwt.sign(
    user.email,
    `${process.env.ACCESS_TOKEN_SECRET}`,
    {
      expiresIn: "1m",
    }
  );
  // My time zone is 3h before the Dev tools timezone
  // Ex: 2024-06-12T01:06:33.440Z // Mine is 2024-05-12T10:06:33.440Z
  // The timezone format is YY/MM/DD-T-hh:mm:ss.SSS
  res.cookie("accessToken", accessToken, {
    // maxAge is set in miliseconds; Ex:  1000 = 1s, 60 * 1000 = 5 seconds, 5 * 60000 = 5 minutes
    maxAge: 60000 * 5,
    httpOnly: true,
  });
  res.status(200).json({ jwtToken: accessToken });

  next();
}

// ------------------------ Checking the authentication here ------------------------------

export function authentication(req: any, res: any, next?: any) {
  // it is an object containing all the application cookies
  // Getting the authorization jwt token in the object cookies
  const cookies = cookie.parse(req.headers?.cookie || "");
  const { accessToken } = cookies;

  console.log(accessToken);

  if (!accessToken) {
    return res
      .status(403)
      .json({ message: "You have no token to perform this operation" });
  }

  jwt.verify(
    accessToken,
    `${process.env.ACCESS_TOKEN_SECRET}`,
    (err: any, user: any) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ message: "Token invalid or expired." });
      }
      console.log(user);
      next();
    }
  );
}
