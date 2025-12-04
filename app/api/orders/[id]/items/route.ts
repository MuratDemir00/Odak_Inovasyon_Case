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

export async function GET(req: Request, context: any) {
  const { id } = await context.params;

  const items = await readItems();
  const filtered = items.filter((i: any) => i.orderId == id);

  return NextResponse.json(filtered);
}

export async function POST(req: Request, context: any) {
  const { id } = await context.params;
  const body = await req.json();
  const items = await readItems();

  const newItem = {
    id: Date.now(),
    orderId: Number(id),
    ...body,
  };

  items.push(newItem);
  await writeItems(items);

  return NextResponse.json(newItem);
}

export async function PUT(req: Request, context: any) {
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

// export async function DELETE(req: Request, context: any) {
//   const { searchParams } = new URL(req.url);
//   const itemId = Number(searchParams.get("id"));

//   if (!itemId) {
//     return NextResponse.json({ error: "id is required" }, { status: 400 });
//   }

//   let items = await readItems();
//   items = items.filter((i: any) => i.id !== itemId);

//   await writeItems(items);

//   return NextResponse.json({ success: true });
// }

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

