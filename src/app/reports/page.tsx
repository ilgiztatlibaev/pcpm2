"use client";
import { useEffect, useMemo, useState } from "react";
import AppTabs from "@/components/AppTabs";
import Button from "@/components/ui/Button";
import { formatMoney } from "@/utils/format";
import { downloadCsv, toCsv } from "@/utils/csv";

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

export default function ReportsPage() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    fetch("/api/purchase-items").then((r) => r.json()).then(setItems);
  }, []);

  const currency = items[0]?.currency ?? "RUB";
  const totalByStatus = useMemo(() => {
    const map: Record<string, number> = {};
    for (const i of items) map[i.status] = (map[i.status] ?? 0) + Number(i.sum);
    return map;
  }, [items]);

  const totalBySub = useMemo(() => {
    const map: Record<string, number> = {};
    for (const i of items) map[i.subproject] = (map[i.subproject] ?? 0) + Number(i.sum);
    return map;
  }, [items]);

  const total = items.reduce((a, i) => a + Number(i.sum), 0);

  const rows = useMemo(() => {
    return [
      ["Свод по статусам", "", ""],
      ...Object.entries(totalByStatus).map(([s, v]) => [s, v, ""]),
      ["Итого", total, ""],
      ["", "", ""],
      ["Свод по субпроектам", "", ""],
      ...Object.entries(totalBySub).map(([s, v]) => [s, v, ""]),
    ];
  }, [totalByStatus, totalBySub, total]);

  function exportCsv() {
    const csv = toCsv([
      ["Субпроект", "Название", "Кол-во", "Цена", "Валюта", "Сумма", "Статус"],
      ...items.map((i) => [i.subproject, i.title, i.quantity, i.price, i.currency, i.sum, i.status]),
    ]);
    downloadCsv("purchase_report.csv", csv);
  }

  return (
    <div className="space-y-6">
      <AppTabs />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Отчёты</h1>
        <Button onClick={exportCsv}>
          Экспорт CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 text-sm text-gray-600">Свод по статусам</div>
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(totalByStatus).map(([s, v]) => (
                <tr key={s} className="border-t">
                  <td className="p-2">{s}</td>
                  <td className="p-2 text-right">{formatMoney(v, currency)}</td>
                </tr>
              ))}
              <tr className="border-t font-semibold">
                <td className="p-2">Итого</td>
                <td className="p-2 text-right">{formatMoney(total, currency)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 text-sm text-gray-600">Свод по субпроектам</div>
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(totalBySub).map(([s, v]) => (
                <tr key={s} className="border-t">
                  <td className="p-2">{s}</td>
                  <td className="p-2 text-right">{formatMoney(v, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-2 text-sm text-gray-600">Детализация</div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Субпроект</th>
              <th className="p-2 text-left">Название</th>
              <th className="p-2">Кол-во</th>
              <th className="p-2">Цена</th>
              <th className="p-2">Валюта</th>
              <th className="p-2">Сумма</th>
              <th className="p-2">Статус</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-t">
                <td className="p-2">{i.subproject}</td>
                <td className="p-2">{i.title}</td>
                <td className="p-2 text-center">{i.quantity}</td>
                <td className="p-2 text-right">{i.price}</td>
                <td className="p-2 text-center">{i.currency}</td>
                <td className="p-2 text-right">{formatMoney(Number(i.sum), i.currency)}</td>
                <td className="p-2">{i.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


