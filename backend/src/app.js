import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config(
    {
        path: '../.env'
    }
)

const app = express();


app.use(cors({
    origin: [],
    methods: ["GET", "PUT", "DELETE", "POST"],
    credentials: true
}))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

export default app