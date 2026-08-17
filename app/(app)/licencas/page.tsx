"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import ProgressoLince from "@/components/ProgressoLince";
import { linkWhatsappRenovacao } from "@/lib/whatsapp";

type Filtro = "ativas" | "andamento" | "vencendo";

export default function LicencasPage() {
  const searchParams = useSearchParams();
  const filtroInicial = (searchParams.get("filtro") as Filtro) || "ativas";
  const [filtro, setFiltro] = useState<Filtro>(filtroInicial);

  const [licencas, setLicencas] = useState<any[]>([]);
  const [processos, setProcessos] = useState<any[]>([]);

  useEffect(() => {
    async function carregar() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: cliente } = await supabase
        .from("clientes")
        .select("id")
        .eq("auth_user_id", user?.id)
        .single();
      if (!cliente) return;

      const { data: licencasData } = await supabase
        .from("licencas")
        .select("*")
        .eq("cliente_id", cliente.id);
      setLicencas(licencasData ?? []);

      const { data: processosData } = await supabase
        .from("processos")
        .select("*")
        .eq("cliente_id", cliente.id)
        .eq("status", "em_andamento");
      setProcessos(processosData ?? []);
    }
    carregar();
  }, []);

  const ativas = licencas.filter((l) => l.status === "ativa");
  const vencendoOuVencidas = licencas.filter(
    (l) => l.status === "vencendo" || l.status === "vencida"
  );

  async function baixarLicenca(caminhoArquivo: string, nomeArquivo: string) {
    const { data, error } = await supabase.storage
      .from("licencas")
      .download(caminhoArquivo);
    if (error || !data) return;
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomeArquivo;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-6">
      <h1
        className="text-lg font-medium text-[#0A1E3C] mb-4"
        style={{ fontFamily: "var(--font-voice, serif)" }}
      >
        Licenças
      </h1>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <button
          onClick={() => setFiltro("ativas")}
          className={`rounded-xl p-3 text-left transition-colors ${
            filtro === "ativas" ? "ring-[1.5px] ring-[#0A1E3C]" : ""
          } bg-[#F4F5F7]`}
        >
          <p className="text-[15px] font-semibold text-[#0A1E3C]">{ativas.length}</p>
          <p className="text-[9px] text-gray-500 mt-0.5">Ativas</p>
        </button>
        <button
          onClick={() => setFiltro("andamento")}
          className={`rounded-xl p-3 text-left transition-colors ${
            filtro === "andamento" ? "ring-[1.5px] ring-[#0A1E3C]" : ""
          } bg-[#F4F5F7]`}
        >
          <p className="text-[15px] font-semibold text-[#0A1E3C]">{processos.length}</p>
          <p className="text-[9px] text-gray-500 mt-0.5">Em andamento</p>
        </button>
        <button
          onClick={() => setFiltro("vencendo")}
          className={`rounded-xl p-3 text-left transition-colors ${
            filtro === "vencendo" ? "ring-[1.5px] ring-[#0A1E3C]" : ""
          } bg-[#FDEBEA]`}
        >
          <p className="text-[15px] font-semibold text-[#C0392B]">{vencendoOuVencidas.length}</p>
          <p className="text-[9px] text-[#C0392B] mt-0.5">Vencendo</p>
        </button>
      </div>

      {filtro === "ativas" && (
        <div className="space-y-2.5">
          {ativas.map((licenca) => (
            <div
              key={licenca.id}
              className="rounded-xl bg-[#F4F5F7] p-3.5 flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-semibold text-[#1E8E5A] bg-[#E4F5EC] px-2 py-0.5 rounded-full">
                  Em dia
                </span>
                <p className="text-[12px] font-medium text-[#0A1E3C] mt-2">{licenca.nome}</p>
                <p className="text-[10px] text-gray-500">Vence {licenca.data_vencimento}</p>
              </div>
              <button
                onClick={() => baixarLicenca(licenca.caminho_arquivo, `${licenca.nome}.pdf`)}
                className="text-[10px] font-semibold text-[#0A1E3C] border border-gray-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1"
              >
                Baixar
              </button>
            </div>
          ))}
        </div>
      )}

      {filtro === "andamento" && (
        <div className="space-y-2.5">
          {processos.map((processo) => (
            <Link
              key={processo.id}
              href={`/processo/${processo.id}`}
              className="block rounded-xl bg-[#F4F5F7] p-3.5"
            >
              <div className="flex justify-between mb-1.5">
                <span className="text-[12px] font-medium text-[#0A1E3C]">{processo.nome}</span>
                <span className="text-[10px] text-gray-500">{processo.percentual}%</span>
              </div>
              <ProgressoLince percentual={processo.percentual} />
            </Link>
          ))}
        </div>
      )}

      {filtro === "vencendo" && (
        <div className="space-y-2.5">
          {vencendoOuVencidas.map((licenca) => (
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
      )}
    </div>
  );
}
