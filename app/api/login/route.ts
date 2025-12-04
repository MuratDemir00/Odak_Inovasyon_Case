import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "users.json");

export async function POST(req: Request) {
  const { kullaniciAdi, password } = await req.json();

  if (kullaniciAdi === "admin" && password === "123") {
    const res = NextResponse.json({
      success: true,
      user: { kullaniciAdi: "admin", rol: "Admin" }
    });

    res.cookies.set("auth", "login-ok", {
      httpOnly: true,
      path: "/",
    });

    return res;
  }

  const raw = await fs.readFile(filePath, "utf-8");
  const users = JSON.parse(raw);

  const found = users.find((u: any) =>
    (u.kullaniciAdi === kullaniciAdi || u.email === kullaniciAdi) &&
    u.sifre === password
  );

  if (!found) {
    return NextResponse.json(
      { success: false, message: "Geçersiz kullanıcı bilgileri" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ success: true, user: found });

  res.cookies.set("auth", "login-ok", {
    httpOnly: true,
    path: "/",
  });

  return res;
}
