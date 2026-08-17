// Número oficial da Lince para contato via WhatsApp.
const NUMERO_LINCE = "5511943982233";

function montarLink(mensagem: string): string {
  const texto = encodeURIComponent(mensagem);
  return `https://wa.me/${NUMERO_LINCE}?text=${texto}`;
}

// Botão flutuante "Fale conosco" — sem contexto específico
export function linkWhatsappGeral(): string {
  return montarLink("Olá, gostaria de saber o status da minha licença.");
}

// Botão "Renove já" num card de licença vencendo/vencida
export function linkWhatsappRenovacao(
  nomeLicenca: string,
  diasParaVencer?: number
): string {
  const prazo =
    diasParaVencer !== undefined
      ? ` que vence em ${diasParaVencer} dias`
      : "";
  return montarLink(`Olá! Quero renovar minha ${nomeLicenca}${prazo}.`);
}

// Botão "Falar com o time" dentro de uma pendência de documento
export function linkWhatsappPendencia(
  nomeDocumento: string,
  nomeProcesso: string
): string {
  return montarLink(
    `Preciso enviar o documento "${nomeDocumento}" do processo ${nomeProcesso}.`
  );
}
