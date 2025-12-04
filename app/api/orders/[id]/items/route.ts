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

export async function GET(req: any, { params }: any) {
  const items = await readItems();
  const filtered = items.filter((i: any) => i.orderId == params.id);
  return NextResponse.json(filtered);
}

export async function POST(req: Request, { params }: any) {
  const body = await req.json();
  const items = await readItems();

  const newItem = {
    id: Date.now(),
    orderId: Number(params.id),
    ...body,
  };

  items.push(newItem);
  await writeItems(items);

  return NextResponse.json(newItem);
}

export async function PUT(req: Request, { params }: any) {
  const body = await req.json();
  const items = await readItems();

  const index = items.findIndex((i: any) => i.id == body.id);
  if (index === -1) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  items[index] = { ...items[index], ...body };

  await writeItems(items);
  return NextResponse.json(items[index]);
}

export async function DELETE(req: Request, { params }: any) {
  const { searchParams } = new URL(req.url);
  const itemId = Number(searchParams.get("id"));

  if (!itemId) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  let items = await readItems();
  items = items.filter((i: any) => i.id !== itemId);

  await writeItems(items);

  return NextResponse.json({ success: true });
}
