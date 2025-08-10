import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

const data = [
  { subproject: "Сеть", title: "Коммутаторы 48p", quantity: 8, price: 165000, currency: "RUB", status: Prisma.PurchaseStatus.IN_PURCHASE, notes: "ToR" },
  { subproject: "Сеть", title: "Оптика 10G", quantity: 120, price: 4200, currency: "RUB", status: Prisma.PurchaseStatus.CLOSED, notes: "LC-LC" },
  { subproject: "Серверы", title: "Сервер 2U", quantity: 12, price: 490000, currency: "RUB", status: Prisma.PurchaseStatus.DELIVERED },
  { subproject: "Серверы", title: "Сервер 1U", quantity: 6, price: 310000, currency: "RUB", status: Prisma.PurchaseStatus.PLANNED },
  { subproject: "Хранилище", title: "SSD 3.84TB", quantity: 60, price: 23800, currency: "RUB", status: Prisma.PurchaseStatus.APPROVED },
  { subproject: "Безопасность", title: "NGFW лицензии", quantity: 4, price: 240000, currency: "RUB", status: Prisma.PurchaseStatus.PAID },
  { subproject: "Платформа", title: "Лицензия Kubernetes", quantity: 1, price: 900000, currency: "RUB", status: Prisma.PurchaseStatus.CLOSED },
  { subproject: "Стойки", title: "Стойка 42U", quantity: 2, price: 210000, currency: "RUB", status: Prisma.PurchaseStatus.CLOSED },
];

export async function POST() {
  // очистим текущие позиции для повторного запуска
  await prisma.purchaseItem.deleteMany({});
  await prisma.$transaction(
    data.map((d) =>
      prisma.purchaseItem.create({
        data: { ...d, sum: d.quantity * d.price },
      })
    )
  );
  return Response.json({ ok: true, created: data.length });
}

export async function GET() {
  return new Response("Use POST to seed test data", { status: 405 });
}


