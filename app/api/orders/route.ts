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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const user = searchParams.get("user");

  let orders = await readOrders();

  if (start) orders = orders.filter((o: any) => new Date(o.tarih) >= new Date(start));
  if (end) orders = orders.filter((o: any) => new Date(o.tarih) <= new Date(end));
  if (user) orders = orders.filter((o: any) => String(o.temsilciId) === String(user));

  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const body = await req.json();
  const orders = await readOrders();

  const newOrder = {
    id: Date.now(),
    tarih: new Date().toISOString().slice(0, 10),
    ...body
  };

  orders.push(newOrder);
  await writeOrders(orders);

  return NextResponse.json(newOrder);
}
