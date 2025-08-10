"use client";
import { useEffect, useState } from "react";
import { formatMoney } from "@/utils/format";
import AppTabs from "@/components/AppTabs";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";

type Item = {
  id: string;
  subproject: string;
  title: string;
  quantity: number;
  price: number;
  currency: string;
  sum: number;
  status: string;
  createdAt?: string;
};

export default function DashboardPage() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    fetch("/api/purchase-items").then((r) => r.json()).then(setItems);
  }, []);

  const total = items.reduce((a, i) => a + Number(i.sum), 0);
  const paid = items.filter((i) => i.status === "PAID").reduce((a, i) => a + Number(i.sum), 0);
  const closed = items.filter((i) => i.status === "CLOSED").length;

  // Fake time series by index for demo
  const series = items.map((i, idx) => ({ name: String(idx + 1), planned: i.sum, paid: i.status === "PAID" ? i.sum : 0 }));

  // Sum by subproject
  const bySub = Object.values(
    items.reduce((acc: Record<string, { name: string; amount: number }>, i) => {
      acc[i.subproject] = acc[i.subproject] || { name: i.subproject, amount: 0 };
      acc[i.subproject].amount += Number(i.sum);
      return acc;
    }, {})
  );

  const currency = items[0]?.currency ?? "RUB";

  return (
    <div className="space-y-6">
      <AppTabs />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">План, всего</div>
          <div className="text-2xl font-semibold">{formatMoney(total, currency)}</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Оплачено</div>
          <div className="text-2xl font-semibold">{formatMoney(paid, currency)}</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Закрыто позиций</div>
          <div className="text-2xl font-semibold">{closed}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 text-sm text-gray-600">Динамика (план/оплачено)</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="planned" stroke="#3b82f6" dot={false} />
                <Line type="monotone" dataKey="paid" stroke="#10b981" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 text-sm text-gray-600">Сумма по субпроектам</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bySub}>
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}


