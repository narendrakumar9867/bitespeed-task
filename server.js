import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import { createContactTable } from "./models/contact.model.js";
import contactRoutes from "./routes/contact.routes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: "3mb"}));
app.use(cookieParser());
app.use("/api", contactRoutes);

await connectDB();
await createContactTable();

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
