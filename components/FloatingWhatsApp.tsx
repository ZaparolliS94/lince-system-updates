"use client";

import { linkWhatsappGeral } from "@/lib/whatsapp";

export default function FloatingWhatsApp() {
  return (
    <a
      href={linkWhatsappGeral()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 flex items-center gap-2 rounded-full bg-[#0A1E3C] px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#0d2650] transition-colors"
      aria-label="Falar com o time da Lince pelo WhatsApp"
    >
      {/* ícone simples de WhatsApp em SVG, sem depender de biblioteca externa */}
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.42a9.9 9.9 0 0 0 4.62 1.18h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.34-.5.05-1.02.24-3.42-.71-2.9-1.15-4.76-4.08-4.9-4.27-.14-.19-1.17-1.56-1.17-2.97 0-1.41.74-2.1 1-2.39.26-.28.57-.35.76-.35h.55c.18 0 .42-.03.65.5.24.53.83 1.85.9 1.99.07.14.12.3.02.48-.1.19-.15.3-.29.46-.15.17-.31.37-.44.5-.15.14-.3.3-.13.6.17.29.75 1.24 1.61 2.01 1.11 1 2.04 1.31 2.34 1.46.3.15.47.13.65-.08.18-.2.75-.87.95-1.17.19-.29.39-.24.65-.15.27.1 1.71.81 2 .96.29.14.48.21.55.33.07.12.07.71-.17 1.39z" />
      </svg>
      Fale conosco
    </a>
  );
}
