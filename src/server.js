import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Load the bundled OpenAPI spec
const swaggerDocument = YAML.load(path.join(__dirname, "../public/bundled.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Temporary in-memory tasks
const tasks = [
  { id: 1, title: "Buy groceries", completed: false },
  { id: 2, title: "Clean the house", completed: true },
];

// GET /tasks/:id
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({
      error: "Validation failed",
      details: ["ID must be a number"],
    });
  }
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  return res.status(200).json(task);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
