"use client";
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Pagination from "@/components/ui/Pagination";
import { formatMoney, parseNumber } from "@/utils/format";
import AppTabs from "@/components/AppTabs";

type Item = {
  id: string;
  subproject: string;
  title: string;
  quantity: number;
  price: number;
  currency: string;
  sum: number;
  status: string;
  notes?: string | null;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState({
    subproject: "",
    title: "",
    quantity: 1,
    price: 0,
    currency: "USD",
    sum: 0,
    status: "PLANNED",
    notes: "",
  });
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    fetch("/api/purchase-items").then((r) => r.json()).then(setItems);
  }, []);

  useEffect(() => {
    const sum = Number(form.quantity) * Number(form.price);
    setForm((f) => ({ ...f, sum }));
  }, [form.quantity, form.price]);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/purchase-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        quantity: Number(form.quantity),
        price: Number(form.price),
        sum: Number(form.sum),
      }),
    });
    if (res.ok) {
      const created = await res.json();
      setItems((prev) => [created, ...prev]);
      setForm({ subproject: "", title: "", quantity: 1, price: 0, currency: "USD", sum: 0, status: "PLANNED", notes: "" });
      setOpen(false);
    } else {
      alert("Ошибка сохранения");
    }
  }

  const total = items.reduce((acc, it) => acc + Number(it.sum), 0);
  const closed = items.filter((i) => i.status === "CLOSED").length;
  const progress = items.length ? Math.round((closed / items.length) * 100) : 0;

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchesQuery = [i.subproject, i.title, i.notes ?? ""].some((v) => v.toLowerCase().includes(query.toLowerCase()));
      const matchesStatus = !statusFilter || i.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [items, query, statusFilter]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  return (
    <div className="space-y-5">
      <AppTabs />
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm">
          <Select>
            <option>RUB</option>
            <option>USD</option>
            <option>KGS</option>
          </Select>
          <Button variant="secondary">Импорт</Button>
          <Button variant="secondary">Экспорт</Button>
          <Button variant="secondary">Настройки</Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Input placeholder="Поиск по названию, цели, комментарию..." value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1" />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Все статусы</option>
          <option>PLANNED</option>
          <option>APPROVED</option>
          <option>IN_PURCHASE</option>
          <option>DELIVERED</option>
          <option>PAID</option>
          <option>CLOSED</option>
        </Select>
        <Button onClick={() => setOpen(true)}>Добавить позицию</Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">Всего позиций: {items.length}</div>
          <div className="text-sm text-gray-600">Общая сумма: {formatMoney(total, items[0]?.currency ?? "RUB")}</div>
        </div>
        <div className="h-2 bg-gray-200 rounded">
          <div className="h-2 bg-emerald-500 rounded" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-md">
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
              <th className="p-2">Комментарий</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((it) => (
              <tr key={it.id} className="odd:bg-white even:bg-gray-50">
                <td className="p-2 border-t border-gray-200">{it.subproject}</td>
                <td className="p-2 border-t border-gray-200">{it.title}</td>
                <td className="p-2 border-t border-gray-200 text-center">{it.quantity}</td>
                <td className="p-2 border-t border-gray-200 text-right">{formatMoney(Number(it.price), it.currency)}</td>
                <td className="p-2 border-t border-gray-200 text-center">{it.currency}</td>
                <td className="p-2 border-t border-gray-200 text-right">{formatMoney(Number(it.sum), it.currency)}</td>
                <td className="p-2 border-t border-gray-200">
                  <Badge color={
                    it.status === "CLOSED"
                      ? "green"
                      : it.status === "IN_PURCHASE" || it.status === "DELIVERED"
                      ? "blue"
                      : it.status === "PAID"
                      ? "orange"
                      : "gray"
                  }>
                    {it.status}
                  </Badge>
                </td>
                <td className="p-2 border-t border-gray-200">{it.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} pageSize={pageSize} total={filtered.length} onChange={setPage} />

      <Modal open={open} onClose={() => setOpen(false)} title="Добавить позицию">
        <form
          onSubmit={(e) => {
            // валидация
            if (!form.subproject || !form.title) {
              e.preventDefault();
              alert("Заполните Субпроект и Название");
              return;
            }
            addItem(e);
          }}
          className="grid grid-cols-2 gap-3"
        >
          <Input placeholder="Субпроект" value={form.subproject} onChange={(e) => setForm({ ...form, subproject: e.target.value })} className="col-span-2" />
          <Input placeholder="Название" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="col-span-2" />
          <Input
            placeholder="Кол-во"
            value={String(form.quantity)}
            onChange={(e) => setForm({ ...form, quantity: Math.max(1, Math.round(parseNumber(e.target.value))) })}
          />
          <Input
            placeholder="Цена"
            value={String(form.price)}
            onChange={(e) => setForm({ ...form, price: parseNumber(e.target.value) })}
            suffix={<span className="text-gray-500">{form.currency}</span>}
          />
          <Select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
            <option>RUB</option>
            <option>USD</option>
            <option>KGS</option>
          </Select>
          <Input disabled value={formatMoney(form.sum, form.currency)} />
          <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option>PLANNED</option>
            <option>APPROVED</option>
            <option>IN_PURCHASE</option>
            <option>DELIVERED</option>
            <option>PAID</option>
            <option>CLOSED</option>
          </Select>
          <Input placeholder="Комментарий" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="col-span-2" />
          <div className="col-span-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
