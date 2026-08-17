"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  processoId: string;
  nomeDocumentoPendente: string;
  onEnviado?: () => void;
}

export default function EnviarDocumento({
  processoId,
  nomeDocumentoPendente,
  onEnviado,
}: Props) {
  const [arrastando, setArrastando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function enviarArquivo(arquivo: File) {
    setErro(null);
    setEnviando(true);
    try {
      const caminho = `${processoId}/${Date.now()}-${arquivo.name}`;
      const { error: erroUpload } = await supabase.storage
        .from("documentos")
        .upload(caminho, arquivo);

      if (erroUpload) throw erroUpload;

      // Registra o documento como "em análise" na tabela documentos.
      // Assim que a equipe aprovar (via Portal Administrativo), o item
      // some de "Pendências" e passa a aparecer em "Documentos enviados".
      const { error: erroInsert } = await supabase.from("documentos").insert({
        processo_id: processoId,
        nome: nomeDocumentoPendente,
        caminho_arquivo: caminho,
        status: "em_analise",
      });
      if (erroInsert) throw erroInsert;

      onEnviado?.();
    } catch (e) {
      setErro("Não foi possível enviar o arquivo. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mb-2.5">
      {/* Área de arrastar e soltar — funciona no desktop; no celular vira só um botão de selecionar */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastando(false);
          const arquivo = e.dataTransfer.files?.[0];
          if (arquivo) enviarArquivo(arquivo);
        }}
        className={`rounded-[9px] border-[1.5px] border-dashed p-4 text-center cursor-pointer transition-colors ${
          arrastando ? "border-[#0A1E3C] bg-white" : "border-gray-300 bg-[#FCFCFD]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const arquivo = e.target.files?.[0];
            if (arquivo) enviarArquivo(arquivo);
          }}
        />
        <p className="text-[10px] font-medium text-[#0A1E3C]">
          {enviando ? "Enviando..." : "Arraste o arquivo aqui"}
        </p>
        <p className="text-[9px] text-gray-400 mt-0.5">
          ou toque para selecionar
        </p>
      </div>
      {erro && <p className="text-[10px] text-[#C0392B] mt-1">{erro}</p>}
    </div>
  );
}
