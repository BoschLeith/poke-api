import dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";
import pokemonRoutes from "@routes/pokemon.routes";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/pokemon", pokemonRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
