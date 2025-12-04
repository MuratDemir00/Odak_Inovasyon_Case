import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "orders.json");

async function readOrders() {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw || "[]");
}

async function writeOrders(data: any) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function GET(req: Request, context: any) {
  const { id } = await context.params;

  const orders = await readOrders();
  const order = orders.find((o: any) => o.id == id);

  return NextResponse.json(order ?? null);
}

export async function PUT(req: Request, context: any) {
  const { id } = await context.params;
  const updated = await req.json();

  const orders = await readOrders();
  const index = orders.findIndex((o: any) => o.id == id);

  if (index === -1) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  orders[index] = { ...orders[index], ...updated };

  await writeOrders(orders);

  return NextResponse.json(orders[index]);
}

export async function DELETE(req: Request, context: any) {
  const { id } = await context.params;

  let orders = await readOrders();
  orders = orders.filter((o: any) => o.id != id);

  await writeOrders(orders);

  return NextResponse.json({ success: true });
}
