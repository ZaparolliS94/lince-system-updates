"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!email || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }

    setCarregando(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    setCarregando(false);

    if (error) {
      setErro("E-mail ou senha incorretos.");
      return;
    }

    // Primeiro acesso: cliente cadastrado com senha padrão precisa trocá-la
    // antes de continuar. O campo "primeiro_acesso" deve existir na tabela
    // clientes (marcado true quando a Lince cria o cadastro).
    const { data: cliente } = await supabase
      .from("clientes")
      .select("primeiro_acesso")
      .eq("auth_user_id", data.user?.id)
      .single();

    if (cliente?.primeiro_acesso) {
      router.push("/primeiro-acesso");
    } else {
      router.push("/inicio");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-[260px] text-center">
        <div className="animate-[fadeIn_0.6s_ease-out]">
          <Image
            src="/lince-icon.png"
            alt="Lince"
            width={56}
            height={56}
            className="mx-auto mb-3"
            priority
          />
          <p
            className="text-lg text-[#0A1E3C] mb-7"
            style={{ fontFamily: "var(--font-voice, serif)" }}
          >
            Lince
          </p>
        </div>

        <form onSubmit={entrar} className="text-left space-y-2.5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@empresa.com"
            className="w-full text-[12px] border border-gray-200 rounded-lg px-3 py-2.5"
          />
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            className="w-full text-[12px] border border-gray-200 rounded-lg px-3 py-2.5"
          />
          {erro && <p className="text-[11px] text-[#C0392B]">{erro}</p>}
          <button
            type="submit"
            disabled={carregando}
            className="w-full text-[12px] font-semibold text-white bg-[#0A1E3C] py-2.5 rounded-lg disabled:opacity-60"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
