import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-6">{children}</main>
      <BottomNav />
      <FloatingWhatsApp />
    </div>
  );
}
