import express from "express";
import "dotenv/config";

import authRoutes from "./routes/authRoutes.js";
import gamesRoutes from "./routes/gamesRoutes.js";

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes); 
app.use("/api/games", gamesRoutes); 



app.listen(PORT, () => {
    console.log(`Servidor Rodando na porta ${PORT}`);
    connectDB();
})