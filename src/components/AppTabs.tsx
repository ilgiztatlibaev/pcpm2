"use client";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppTabs() {
  const pathname = usePathname();
  const is = (p: string) => pathname === p;
  return (
    <div className="flex items-center gap-2 mb-4">
      <Link href="/dashboard">
        <Button variant={is("/dashboard") ? "primary" : "secondary"}>Дашборд</Button>
      </Link>
      <Link href="/">
        <Button variant={is("/") ? "primary" : "secondary"}>План-график</Link>
      </Link>
      <Link href="/reports">
        <Button variant={is("/reports") ? "primary" : "secondary"}>Отчёты</Button>
      </Link>
    </div>
  );
}


