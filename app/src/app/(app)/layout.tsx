import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Sidebar />
      <Header />
      <main
        className="pt-[var(--header-height)] pl-[var(--sidebar-width)] min-h-screen"
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
