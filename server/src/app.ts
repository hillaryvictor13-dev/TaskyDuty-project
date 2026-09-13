import { config } from "dotenv"
import express, { json, Request, Response, NextFunction } from "express"
import createHttpError, { isHttpError } from "http-errors"
import morgan from "morgan"
import cors from "cors"
import userRoutes from "./routes/user.routes.js"
import taskRoutes from "./routes/task.routes.js"

config()
const app = express()

const corsOptions = {
    origin: ['http://localhost:5173', 'https://tasky-duty-project.vercel.app/', 'http://localhost:5174', 'http://localhost:5175'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200, // For legacy browsers
};

app.use(cors(corsOptions));

app.use(json({ limit: "25mb" }))

app.use(express.urlencoded({ limit: "25mb", extended: true }))

app.disable("x-powered-by")
app.use(morgan("combined"))


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api/users", userRoutes)
app.use("/api/tasks", taskRoutes)

app.use((req: Request, res: Response, next: NextFunction) => {
    return next(createHttpError(404, "Route not found"))
})

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error)
    let statusCode = 500
    let errorMessage = "Internal server error, please try again later"

    if (isHttpError(error)) {
        statusCode = error.status
        errorMessage = error.message
    }

    res.status(statusCode).json({ error: errorMessage })
})

export default app