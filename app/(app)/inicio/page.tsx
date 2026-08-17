import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import RegularidadeCard from "@/components/RegularidadeCard";
import ProgressoLince from "@/components/ProgressoLince";
import { linkWhatsappRenovacao } from "@/lib/whatsapp";

// Esta página busca os dados do cliente logado direto no Supabase.
// Ajuste os nomes das colunas abaixo caso o schema real use nomes
// diferentes dos combinados em conversas anteriores (clientes, processos,
// licencas, documentos).
export default async function InicioPage() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: cliente } = await supabase
    .from("clientes")
    .select("*")
    .eq("auth_user_id", user?.id)
    .single();

  const { data: licencas } = await supabase
    .from("licencas")
    .select("*")
    .eq("cliente_id", cliente?.id);

  const { data: processos } = await supabase
    .from("processos")
    .select("*")
    .eq("cliente_id", cliente?.id)
    .eq("status", "em_andamento");

  const listaLicencas = licencas ?? [];
  const ativas = listaLicencas.filter((l) => l.status === "ativa");
  const vencendo = listaLicencas.filter((l) => l.status === "vencendo");
  const vencidas = listaLicencas.filter((l) => l.status === "vencida");
  const listaProcessos = processos ?? [];

  return (
    <div className="max-w-xl mx-auto px-5 py-6">
      <h1 className="text-lg font-medium text-[#0A1E3C] mb-4" style={{ fontFamily: "var(--font-voice, serif)" }}>
        Olá, {cliente?.razao_social ?? "bem-vindo(a)"}
      </h1>

      <RegularidadeCard licencas={listaLicencas} />

      {/* Cards clicáveis: cada um leva direto pra Licenças já filtrada */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <Link
          href="/licencas?filtro=ativas"
          className="rounded-xl bg-[#F4F5F7] p-3 hover:bg-gray-200 transition-colors"
        >
          <p className="text-[15px] font-semibold text-[#0A1E3C]">{ativas.length}</p>
          <p className="text-[9px] text-gray-500 mt-0.5">Licenças ativas</p>
        </Link>
        <Link
          href="/licencas?filtro=andamento"
          className="rounded-xl bg-[#F4F5F7] p-3 hover:bg-gray-200 transition-colors"
        >
          <p className="text-[15px] font-semibold text-[#0A1E3C]">{listaProcessos.length}</p>
          <p className="text-[9px] text-gray-500 mt-0.5">Em andamento</p>
        </Link>
        <Link
          href="/licencas?filtro=vencendo"
          className="rounded-xl bg-[#FDEBEA] p-3 hover:bg-red-100 transition-colors"
        >
          <p className="text-[15px] font-semibold text-[#C0392B]">
            {vencendo.length + vencidas.length}
          </p>
          <p className="text-[9px] text-[#C0392B] mt-0.5">Vencendo</p>
        </Link>
      </div>

      {(vencendo.length > 0 || vencidas.length > 0) && (
        <>
          <p className="text-[13px] font-medium text-[#C0392B] mb-2" style={{ fontFamily: "var(--font-voice, serif)" }}>
            Vencendo em breve
          </p>
          <div className="space-y-2 mb-5">
            {[...vencidas, ...vencendo].map((licenca) => (
              <div
                key={licenca.id}
                className="rounded-xl bg-[#F4F5F7] p-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-[11px] font-medium text-[#0A1E3C]">{licenca.nome}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {licenca.status === "vencida"
                      ? "Vencida"
                      : `Vence em ${licenca.dias_para_vencer} dias`}
                  </p>
                </div>
                <a
                  href={linkWhatsappRenovacao(licenca.nome, licenca.dias_para_vencer)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-semibold text-white bg-[#C0392B] px-2.5 py-1.5 rounded-lg"
                >
                  Renove já
                </a>
              </div>
            ))}
          </div>
        </>
      )}

      {listaProcessos.length > 0 && (
        <>
          <p className="text-[13px] font-medium text-[#0A1E3C] mb-2" style={{ fontFamily: "var(--font-voice, serif)" }}>
            Em andamento
          </p>
          <div className="space-y-2">
            {listaProcessos.map((processo) => (
              <Link
                key={processo.id}
                href={`/processo/${processo.id}`}
                className="block rounded-xl bg-[#F4F5F7] p-3 hover:bg-gray-200 transition-colors"
              >
                <div className="flex justify-between mb-1.5">
                  <span className="text-[11px] font-medium text-[#0A1E3C]">{processo.nome}</span>
                  <span className="text-[10px] text-gray-500">{processo.percentual}%</span>
                </div>
                <ProgressoLince percentual={processo.percentual} />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
