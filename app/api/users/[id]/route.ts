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

export async function GET(req: Request, context: any) {
  const params = await context.params;
  const id = Number(params.id);

  const data = await readData();
  const user = data.find((u: any) => u.id === id);

  return NextResponse.json(user ?? null);
}


export async function PUT(req: Request, context: any) {
  const params = await context.params;
  const id = Number(params.id);

  const body = await req.json();
  const data = await readData();

  const index = data.findIndex((u: any) => u.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  data[index] = { ...data[index], ...body };
  await writeData(data);

  return NextResponse.json({ success: true, user: data[index] });
}



export async function DELETE(req: Request, context: any) {
  const params = await context.params;
  console.log("PARAMS:", params);

  const id = Number(params.id);
  console.log("DELETE ID:", id);

  let data = await readData();

  data = data.filter((u: any) => u.id !== id);

  await writeData(data);

  return NextResponse.json({ success: true });
}
