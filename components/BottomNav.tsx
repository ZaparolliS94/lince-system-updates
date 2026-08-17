"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITENS = [
  { href: "/inicio", label: "Início", icone: "home" },
  { href: "/licencas", label: "Licenças", icone: "file" },
  { href: "/minha-conta", label: "Conta", icone: "user" },
];

function Icone({ nome, ativo }: { nome: string; ativo: boolean }) {
  const cor = ativo ? "#0A1E3C" : "#9CA3AF";
  if (nome === "home") {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth="2" aria-hidden="true">
        <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (nome === "file") {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth="2" aria-hidden="true">
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex border-t border-[#E2E4E9] bg-white pb-[max(10px,env(safe-area-inset-bottom))] pt-2">
      {ITENS.map((item) => {
        const ativo =
          pathname?.startsWith(item.href) ||
          (item.href === "/licencas" && pathname?.startsWith("/processo"));
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 flex flex-col items-center gap-1"
          >
            <Icone nome={item.icone} ativo={!!ativo} />
            <span
              className={`text-[9px] ${
                ativo ? "text-[#0A1E3C] font-medium" : "text-gray-400"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
