import { prisma } from "@/lib/prisma";
import { z } from "zod";


const itemSchema = z.object({
  subproject: z.string().min(1),
  title: z.string().min(1),
  quantity: z.number().int().min(1),
  price: z.number().positive(),
  currency: z.string().min(3).max(3),
  sum: z.number().positive(),
  status: z
    .enum(["PLANNED", "APPROVED", "IN_PURCHASE", "DELIVERED", "PAID", "CLOSED"]) // must match enum
    .default("PLANNED"),
  notes: z.string().optional().nullable(),
});

export async function GET() {
  const items = await prisma.purchaseItem.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json(items);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = itemSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify(parsed.error.format()), { status: 400 });
  }
  const data = parsed.data;
  const created = await prisma.purchaseItem.create({ data });
  return Response.json(created, { status: 201 });
}


