import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "settings.json");

export async function GET() {
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json({ error: "Impossible de lire les paramètres" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Impossible d'enregistrer les paramètres" }, { status: 500 });
  }
}
