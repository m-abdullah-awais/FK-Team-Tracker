import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();

app.use(express.json());

app.use(morgan('dev'));

const allowedOrigins = [
    "https://fk-team-frontend.vercel.app",
    "http://localhost:3002"
    
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

app.use(express.static("public"));

app.use(cookieParser());

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import teamRoutes from "./routes/team.routes.js";
import apiHealthRoutes from "./routes/apiHealth.routes.js";
import cookieRoutes from "./routes/cookie.routes.js";
import workSummaryRoutes from "./routes/workSummary.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import todoRoutes from './routes/todo.routes.js';
import taskRoutes from './routes/task.routes.js';

import { errorHandler } from "./middlewares/errorHandler.middleware.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/team", teamRoutes);
app.use("/api/v1/api-health", apiHealthRoutes);
app.use("/api/v1/cookie", cookieRoutes);
app.use("/api/v1/workSummary", workSummaryRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use('/api/v1/todos', todoRoutes);
app.use('/api/v1/task', taskRoutes);


app.use(errorHandler);


export default app;