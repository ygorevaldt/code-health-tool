import { Router } from "express";
import { analyzeCode } from "../analyzer/index.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { code } = req.body;

    if (typeof code !== "string") {
      return res.status(400).json({ error: "O campo code deve ser uma string." });
    }

    const result = await analyzeCode(code);
    res.json(result);
  } catch (error) {
    console.error("Analysis request failed:", error);
    res.status(500).json({ error: "Erro ao analisar o código." });
  }
});

export default router;
