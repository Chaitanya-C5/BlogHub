import express from "express";
import cors from "cors";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', postRoutes);
app.use('/api', userRoutes);

app.listen(5000, () => {
    console.log("Listening at port 5000")
});