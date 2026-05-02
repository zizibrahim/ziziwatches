import SessionProvider from "@/components/layout/SessionProvider";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const pendingOrders = await prisma.order.count({ where: { status: "PENDING" } });

  return (
    <SessionProvider>
      <div className="min-h-screen bg-background flex">
        <AdminSidebar locale={params.locale} pendingOrders={pendingOrders} />

        {/* Main — add top padding on mobile for the fixed top bar */}
        <div className="flex-1 overflow-auto pt-14 lg:pt-0">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
