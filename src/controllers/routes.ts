import authRouter from "./auth/auth.route";
import userRouter from "./user/user.route";
import bookRouter from "./book/book.route";

export const routes = [
     authRouter,
     userRouter,
     bookRouter
];

export type AppRoute = (typeof routes)[number];
