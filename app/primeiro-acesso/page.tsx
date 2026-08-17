"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function PrimeiroAcessoPage() {
  const router = useRouter();
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function trocarSenha(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (novaSenha.length < 8) {
      setErro("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setSalvando(true);
    const { data, error } = await supabase.auth.updateUser({ password: novaSenha });
    if (error) {
      setErro("Não foi possível salvar a nova senha. Tente novamente.");
      setSalvando(false);
      return;
    }

    // Marca que o cliente já passou pelo primeiro acesso
    await supabase
      .from("clientes")
      .update({ primeiro_acesso: false })
      .eq("auth_user_id", data.user?.id);

    router.push("/inicio");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-[280px] text-center">
        <Image
          src="/lince-icon.png"
          alt="Lince"
          width={44}
          height={44}
          className="mx-auto mb-3"
        />
        <p className="text-base font-medium text-[#0A1E3C] mb-1">Bem-vindo(a) à Lince</p>
        <p className="text-[11px] text-gray-500 mb-6">
          Por segurança, crie uma nova senha antes de continuar.
        </p>

        <form onSubmit={trocarSenha} className="text-left space-y-2.5">
          <input
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            placeholder="Nova senha"
            className="w-full text-[12px] border border-gray-200 rounded-lg px-3 py-2.5"
          />
          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            placeholder="Confirmar nova senha"
            className="w-full text-[12px] border border-gray-200 rounded-lg px-3 py-2.5"
          />
          {erro && <p className="text-[11px] text-[#C0392B]">{erro}</p>}
          <button
            type="submit"
            disabled={salvando}
            className="w-full text-[12px] font-semibold text-white bg-[#0A1E3C] py-2.5 rounded-lg disabled:opacity-60"
          >
            {salvando ? "Salvando..." : "Salvar e continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}
