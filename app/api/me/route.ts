import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "users.json");

export async function GET(req: Request) {
    const cookies = req.headers.get("cookie") || "";
    const auth = cookies.includes("auth=login-ok");

    if (!auth) {
        return NextResponse.json({ loggedIn: false, user: null });
    }

    const raw = await fs.readFile(filePath, "utf-8");
    const users = JSON.parse(raw);

    const found = users[0];

    return NextResponse.json({
        loggedIn: true,
        user: found || { kullaniciAdi: "admin", fullName: "Admin Kullanıcı" }
    });
}
