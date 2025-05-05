import express, { urlencoded } from "express";
import cors from "cors";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import db from "./config/db.js";
import fileUpload from 'express-fileupload';

const file = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

const app = express();
db();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(cors());
app.use(urlencoded({ extended: true }))
app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );
  

app.use('/api', postRoutes);
app.use('/api', userRoutes);

app.listen(5000, () => {
    console.log("Listening at port 5000")
});