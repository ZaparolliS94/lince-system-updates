"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MinhaContaPage() {
  const [cliente, setCliente] = useState<any>(null);
  const [emailAtual, setEmailAtual] = useState("");

  const [novoEmail, setNovoEmail] = useState("");
  const [editandoEmail, setEditandoEmail] = useState(false);
  const [statusEmail, setStatusEmail] = useState<string | null>(null);

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [editandoSenha, setEditandoSenha] = useState(false);
  const [statusSenha, setStatusSenha] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setEmailAtual(user?.email ?? "");

      const { data: clienteData } = await supabase
        .from("clientes")
        .select("*")
        .eq("auth_user_id", user?.id)
        .single();
      setCliente(clienteData);
    }
    carregar();
  }, []);

  async function alterarEmail() {
    setStatusEmail(null);
    if (!novoEmail || !novoEmail.includes("@")) {
      setStatusEmail("Digite um e-mail válido.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ email: novoEmail });
    if (error) {
      setStatusEmail("Não foi possível alterar o e-mail. Tente novamente.");
      return;
    }
    setStatusEmail("Enviamos um link de confirmação para o novo e-mail.");
    setEditandoEmail(false);
  }

  async function alterarSenha() {
    setStatusSenha(null);
    if (novaSenha.length < 8) {
      setStatusSenha("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setStatusSenha("As senhas não coincidem.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    if (error) {
      setStatusSenha("Não foi possível alterar a senha. Tente novamente.");
      return;
    }
    setStatusSenha("Senha alterada com sucesso.");
    setEditandoSenha(false);
    setNovaSenha("");
    setConfirmarSenha("");
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-6">
      <h1
        className="text-lg font-medium text-[#0A1E3C] mb-4"
        style={{ fontFamily: "var(--font-voice, serif)" }}
      >
        Minha conta
      </h1>

      <div className="rounded-xl bg-[#F4F5F7] p-3.5 mb-2.5">
        <p className="text-[9px] text-gray-500 mb-1.5">Razão social</p>
        <p className="text-[12px] text-[#0A1E3C]">{cliente?.razao_social}</p>
      </div>

      <div className="rounded-xl bg-[#F4F5F7] p-3.5 mb-2.5">
        <p className="text-[9px] text-gray-500 mb-1.5">E-mail de acesso</p>
        {!editandoEmail ? (
          <div className="flex items-center justify-between">
            <p className="text-[12px] text-[#0A1E3C]">{emailAtual}</p>
            <button
              onClick={() => setEditandoEmail(true)}
              className="text-[10px] font-semibold text-[#0A1E3C] border border-gray-200 bg-white px-2.5 py-1.5 rounded-lg"
            >
              Alterar e-mail
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="email"
              value={novoEmail}
              onChange={(e) => setNovoEmail(e.target.value)}
              placeholder="novo@email.com"
              className="w-full text-[12px] border border-gray-200 rounded-lg px-2.5 py-2"
            />
            <div className="flex gap-2">
              <button
                onClick={alterarEmail}
                className="text-[10px] font-semibold text-white bg-[#0A1E3C] px-2.5 py-1.5 rounded-lg"
              >
                Salvar
              </button>
              <button
                onClick={() => setEditandoEmail(false)}
                className="text-[10px] text-gray-500"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
        {statusEmail && <p className="text-[10px] text-gray-500 mt-2">{statusEmail}</p>}
      </div>

      <div className="rounded-xl bg-[#F4F5F7] p-3.5 mb-2.5">
        <p className="text-[9px] text-gray-500 mb-1.5">Senha</p>
        {!editandoSenha ? (
          <div className="flex items-center justify-between">
            <p className="text-[12px] text-[#0A1E3C]">••••••••</p>
            <button
              onClick={() => setEditandoSenha(true)}
              className="text-[10px] font-semibold text-[#0A1E3C] border border-gray-200 bg-white px-2.5 py-1.5 rounded-lg"
            >
              Alterar senha
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Nova senha"
              className="w-full text-[12px] border border-gray-200 rounded-lg px-2.5 py-2"
            />
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Confirmar nova senha"
              className="w-full text-[12px] border border-gray-200 rounded-lg px-2.5 py-2"
            />
            <div className="flex gap-2">
              <button
                onClick={alterarSenha}
                className="text-[10px] font-semibold text-white bg-[#0A1E3C] px-2.5 py-1.5 rounded-lg"
              >
                Salvar
              </button>
              <button
                onClick={() => setEditandoSenha(false)}
                className="text-[10px] text-gray-500"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
        {statusSenha && <p className="text-[10px] text-gray-500 mt-2">{statusSenha}</p>}
      </div>

      <div className="rounded-xl bg-[#F4F5F7] p-3.5 opacity-55">
        <p className="text-[11px] font-medium text-[#0A1E3C] mb-1">Meios de pagamento</p>
        <p className="text-[10px] text-gray-500">
          Em breve você poderá gerenciar seus dados de pagamento por aqui.
        </p>
      </div>
    </div>
  );
}
