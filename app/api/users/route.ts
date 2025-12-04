import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "users.json");

async function readData() {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    if (!raw.trim()) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("READ ERROR:", err);
    return [];
  }
}

async function writeData(data: any) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const data = await readData();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await readData();

    const maxId = data.length > 0 ? Math.max(...data.map((u: any) => u.id)) : 0;

    const newUser = {
      id: maxId + 1,
      ...body
    };

    data.push(newUser);
    await writeData(data);

    return NextResponse.json({ success: true, user: newUser });
  } catch (err) {
    console.error("POST ERROR:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
