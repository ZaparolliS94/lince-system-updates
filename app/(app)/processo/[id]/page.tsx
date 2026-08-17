"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import TimelineProcesso, { EtapaProcesso } from "@/components/TimelineProcesso";
import EnviarDocumento from "@/components/EnviarDocumento";
import { linkWhatsappPendencia } from "@/lib/whatsapp";

type Aba = "enviados" | "protocolos" | "pendencias";

export default function ProcessoDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [aba, setAba] = useState<Aba>("enviados");

  const [processo, setProcesso] = useState<any>(null);
  const [etapas, setEtapas] = useState<EtapaProcesso[]>([]);
  const [documentosEnviados, setDocumentosEnviados] = useState<any[]>([]);
  const [protocolos, setProtocolos] = useState<any[]>([]);
  const [pendencias, setPendencias] = useState<any[]>([]);

  async function carregar() {
    const { data: processoData } = await supabase
      .from("processos")
      .select("*")
      .eq("id", id)
      .single();
    setProcesso(processoData);

    const { data: etapasData } = await supabase
      .from("etapas_processo")
      .select("*")
      .eq("processo_id", id)
      .order("ordem");
    setEtapas(
      (etapasData ?? []).map((e) => ({
        nome: e.nome,
        status: e.status,
        data: e.data_conclusao ? `Concluída em ${e.data_conclusao}` : undefined,
      }))
    );

    const { data: documentos } = await supabase
      .from("documentos")
      .select("*")
      .eq("processo_id", id);

    setDocumentosEnviados((documentos ?? []).filter((d) => d.status === "aprovado"));
    setPendencias((documentos ?? []).filter((d) => d.status === "pendente"));

    const { data: protocolosData } = await supabase
      .from("protocolos")
      .select("*")
      .eq("processo_id", id);
    setProtocolos(protocolosData ?? []);
  }

  useEffect(() => {
    if (id) carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function baixarDocumento(caminhoArquivo: string, nomeArquivo: string) {
    const { data, error } = await supabase.storage
      .from("documentos")
      .download(caminhoArquivo);
    if (error || !data) return;
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomeArquivo;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!processo) {
    return <div className="max-w-xl mx-auto px-5 py-6 text-sm text-gray-500">Carregando...</div>;
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-6">
      <div className="flex items-center gap-2 mb-1">
        <button
          onClick={() => router.push("/licencas?filtro=andamento")}
          aria-label="Voltar para Licenças"
          className="text-[#0A1E3C]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-lg font-medium text-[#0A1E3C]" style={{ fontFamily: "var(--font-voice, serif)" }}>
          {processo.nome}
        </h1>
      </div>
      <p className="text-[10px] text-gray-500 mb-4 ml-6">Etapa atual: {processo.etapa_atual}</p>

      <TimelineProcesso etapas={etapas} />

      <div className="flex gap-1.5 border-b border-gray-200 mb-3.5">
        {(
          [
            { key: "enviados", label: "Documentos enviados" },
            { key: "protocolos", label: "Protocolos" },
            { key: "pendencias", label: `Pendências${pendencias.length ? ` ${pendencias.length}` : ""}` },
          ] as { key: Aba; label: string }[]
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => setAba(t.key)}
            className={`text-[11px] px-2.5 py-2 text-[#0A1E3C] border-b-2 ${
              aba === t.key ? "border-[#E69628] font-semibold" : "border-transparent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {aba === "enviados" && (
        <div className="space-y-2">
          {documentosEnviados.length === 0 && (
            <p className="text-[11px] text-gray-400">Nenhum documento enviado ainda.</p>
          )}
          {documentosEnviados.map((doc) => (
            <div
              key={doc.id}
              className="rounded-xl bg-[#F4F5F7] px-3.5 py-3 flex items-center justify-between"
            >
              <span className="text-[12px] text-[#0A1E3C]">{doc.nome}</span>
              <span className="flex items-center gap-2.5">
                <span className="text-[10px] text-[#1E8E5A]">Aprovado</span>
                <button
                  onClick={() => baixarDocumento(doc.caminho_arquivo, doc.nome)}
                  aria-label={`Baixar ${doc.nome}`}
                  className="text-[#0A1E3C]"
                >
                  ↓
                </button>
              </span>
            </div>
          ))}
        </div>
      )}

      {aba === "protocolos" && (
        <div className="space-y-2">
          {protocolos.length === 0 && (
            <p className="text-[11px] text-gray-400">Nenhum protocolo registrado ainda.</p>
          )}
          {protocolos.map((p) => (
            <div
              key={p.id}
              className="rounded-xl bg-[#F4F5F7] px-3.5 py-3 flex items-center justify-between"
            >
              <span className="text-[12px] text-[#0A1E3C]">{p.numero}</span>
              <span className="flex items-center gap-2.5">
                <span className="text-[10px] text-gray-500">{p.data}</span>
                {p.caminho_arquivo && (
                  <button
                    onClick={() => baixarDocumento(p.caminho_arquivo, `${p.numero}.pdf`)}
                    aria-label={`Baixar protocolo ${p.numero}`}
                    className="text-[#0A1E3C]"
                  >
                    ↓
                  </button>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      {aba === "pendencias" && (
        <div className="space-y-3">
          {pendencias.length === 0 && (
            <p className="text-[11px] text-gray-400">Tudo certo por aqui — nenhuma pendência no momento.</p>
          )}
          {pendencias.map((pend) => (
            <div key={pend.id} className="rounded-xl bg-[#FDEBEA] p-3.5">
              <p className="text-[12px] font-semibold text-[#C0392B]">{pend.nome}</p>
              <p className="text-[10px] text-[#C0392B] mt-1 mb-3">
                Precisamos desse documento pra continuar o processo.
              </p>

              <EnviarDocumento
                processoId={id as string}
                nomeDocumentoPendente={pend.nome}
                onEnviado={carregar}
              />

              <a
                href={linkWhatsappPendencia(pend.nome, processo.nome)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[10px] font-semibold text-white bg-[#1E8E5A] px-2.5 py-1.5 rounded-lg"
              >
                Falar com o time
              </a>
            </div>
          ))}
          {pendencias.length > 0 && (
            <p className="text-[10px] text-gray-500">
              Assim que aprovarmos, o item some daqui e vai pra "Documentos enviados".
            </p>
          )}
        </div>
      )}
    </div>
  );
}
