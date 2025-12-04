"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        const check = async () => {
            const res = await fetch("/api/me");
            const data = await res.json();
            setLoggedIn(data.loggedIn);
        };
        check();
    }, []);

    const handleLogout = async () => {
        await fetch("/api/logout");
        router.push("/login");
    };

    if (loggedIn === null) return null;
    if (loggedIn === false) return null;

    const linkClass = (path: string) =>
        `px-4 py-2 rounded-lg text-sm transition ${pathname.startsWith(path)
            ? "bg-neutral-700 text-white"
            : "text-neutral-300 hover:bg-neutral-700 hover:text-white"
        }`;

    return (
        <nav className="w-full bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/users" className={linkClass("/users")}>
                    Kullanıcılar
                </Link>

                <Link href="/orders" className={linkClass("/orders")}>
                    Siparişler
                </Link>
            </div>

            <div className="flex items-center gap-4">


                <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg text-sm bg-red-600 hover:bg-red-700 text-white transition"
                >
                    Çıkış Yap
                </button>
            </div>
        </nav>
    );
}
