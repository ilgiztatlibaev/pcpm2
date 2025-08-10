"use client";
import Button from "@/components/ui/Button";
import { usePathname } from "next/navigation";

export default function AppTabs() {
  const pathname = usePathname();
  const is = (p: string) => pathname === p;
  return (
    <div className="flex items-center gap-2 mb-4">
      <a href="/dashboard">
        <Button variant={is("/dashboard") ? "primary" : "secondary"}>Дашборд</Button>
      </a>
      <a href="/">
        <Button variant={is("/") ? "primary" : "secondary"}>План-график</Button>
      </a>
      <a href="/reports">
        <Button variant={is("/reports") ? "primary" : "secondary"}>Отчёты</Button>
      </a>
    </div>
  );
}


