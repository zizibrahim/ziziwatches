import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { subDays, startOfDay, format } from "date-fns";

export async function GET() {
  const now = new Date();
  const days30ago = subDays(now, 30);

  // Orders from last 30 days
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: days30ago } },
    select: { createdAt: true, total: true, status: true },
    orderBy: { createdAt: "asc" },
  });

  // Group by day
  const byDay: Record<string, { date: string; orders: number; revenue: number }> = {};
  for (let i = 29; i >= 0; i--) {
    const d = format(startOfDay(subDays(now, i)), "dd/MM");
    byDay[d] = { date: d, orders: 0, revenue: 0 };
  }
  for (const o of orders) {
    const d = format(startOfDay(o.createdAt), "dd/MM");
    if (byDay[d]) {
      byDay[d].orders++;
      byDay[d].revenue += o.total;
    }
  }

  // Totals
  const [totalOrders, totalRevenue, totalProducts, totalCustomers] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
  ]);

  // Order status breakdown
  const statusGroups = await prisma.order.groupBy({
    by: ["status"],
    _count: true,
  });

  return NextResponse.json({
    chart: Object.values(byDay),
    totals: {
      orders: totalOrders,
      revenue: totalRevenue._sum.total ?? 0,
      products: totalProducts,
      customers: totalCustomers,
    },
    statusBreakdown: statusGroups.map((s) => ({ status: s.status, count: s._count })),
  });
}
