"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const ITENS = [
  { href: "/inicio", label: "Início" },
  { href: "/licencas", label: "Licenças" },
  { href: "/minha-conta", label: "Minha conta" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:w-56 md:shrink-0 bg-[#0A1E3C] py-6 px-3">
      <div className="flex items-center gap-2 px-3 pb-6">
        <Image
          src="/lince-icon.png"
          alt="Lince"
          width={28}
          height={28}
          priority
        />
        <span className="text-white font-medium text-sm">Lince</span>
      </div>

      <nav className="flex flex-col gap-1">
        {ITENS.map((item) => {
          // "Licenças" também fica ativo quando estamos dentro de /processo/[id]
          const ativo =
            pathname?.startsWith(item.href) ||
            (item.href === "/licencas" && pathname?.startsWith("/processo"));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm border-l-[3px] transition-colors ${
                ativo
                  ? "bg-white/10 text-white border-[#E69628] font-medium"
                  : "text-[#C7CDDB] border-transparent hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
