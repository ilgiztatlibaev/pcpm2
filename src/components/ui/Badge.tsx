import React from "react";
import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  color?: "gray" | "green" | "blue" | "orange" | "red";
  className?: string;
};

export default function Badge({ children, color = "gray", className }: Props) {
  const map = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    orange: "bg-orange-100 text-orange-700",
    red: "bg-rose-100 text-rose-700",
  } as const;
  return <span className={clsx("inline-flex rounded px-2 py-0.5 text-xs", map[color], className)}>{children}</span>;
}


