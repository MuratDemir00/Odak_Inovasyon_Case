import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "orderItems.json");

async function readItems() {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw || "[]");
}

async function writeItems(data: any) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function DELETE(req: Request, context: any) {
  const params = await context.params;
  console.log("PARAMS:", params);

  const id = Number(params.id);
  console.log("DELETE ID:", id);

  let data = await readItems();

  data = data.filter((u: any) => u.id !== id);

  await writeItems(data);

  return NextResponse.json({ success: true });
}
