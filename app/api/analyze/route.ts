import { NextResponse } from "next/server";
import { analyzeCode } from "../../../lib/analyzer";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const code = typeof payload?.code === "string" ? payload.code : "";
    const type = typeof payload?.type === "string" ? payload.type : "javascript";

    if (!code) {
      return NextResponse.json({ error: "O campo code deve ser uma string não vazia." }, { status: 400 });
    }

    const result = await analyzeCode(code, type as any);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Analyzer Error:", error);
    return NextResponse.json({ error: "Falha ao analisar o código." }, { status: 500 });
  }
}
