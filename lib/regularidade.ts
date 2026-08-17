// Calcula a % de regularidade da empresa com base SOMENTE nas licenças
// que já existem (ativas, vencendo, vencidas). Processos em andamento
// (licenças novas ainda não emitidas) não entram nessa conta, porque
// não são uma irregularidade — são algo sendo resolvido.
//
// Pontuação por licença:
//   ativa em dia      -> 1 ponto
//   vencendo (<=60d)  -> 0.5 ponto
//   vencida           -> 0 ponto
//
// % regularidade = (soma dos pontos / total de licenças) * 100

export type StatusLicenca = "ativa" | "vencendo" | "vencida";

export interface LicencaParaCalculo {
  status: StatusLicenca;
}

export interface ResultadoRegularidade {
  percentual: number; // 0 a 100, já arredondado
  faixa: "boa" | "atencao" | "critica";
  mensagem: string;
}

const PONTOS: Record<StatusLicenca, number> = {
  ativa: 1,
  vencendo: 0.5,
  vencida: 0,
};

export function calcularRegularidade(
  licencas: LicencaParaCalculo[]
): ResultadoRegularidade {
  if (licencas.length === 0) {
    return {
      percentual: 100,
      faixa: "boa",
      mensagem: "Nenhuma licença cadastrada ainda.",
    };
  }

  const soma = licencas.reduce((acc, l) => acc + PONTOS[l.status], 0);
  const percentual = Math.round((soma / licencas.length) * 100);

  const qtdVencidas = licencas.filter((l) => l.status === "vencida").length;
  const qtdVencendo = licencas.filter((l) => l.status === "vencendo").length;

  let faixa: ResultadoRegularidade["faixa"] = "boa";
  if (percentual < 50) faixa = "critica";
  else if (percentual < 80) faixa = "atencao";

  let mensagem = "Sua empresa está em dia com todas as licenças.";
  if (qtdVencidas > 0) {
    mensagem = `${qtdVencidas} licença${
      qtdVencidas > 1 ? "s" : ""
    } vencida${qtdVencidas > 1 ? "s" : ""} está${
      qtdVencidas > 1 ? "ão" : ""
    } pesando na sua nota.`;
  } else if (qtdVencendo > 0) {
    mensagem = `${qtdVencendo} licença${
      qtdVencendo > 1 ? "s" : ""
    } vencendo em breve.`;
  }

  return { percentual, faixa, mensagem };
}

// Cores (tokens da marca Lince) para cada faixa, usadas no card do Início
export const CORES_FAIXA: Record<
  ResultadoRegularidade["faixa"],
  { bg: string; text: string }
> = {
  boa: { bg: "#E4F5EC", text: "#1E8E5A" },
  atencao: { bg: "#FFF4E5", text: "#B9700D" },
  critica: { bg: "#FDEBEA", text: "#C0392B" },
};
