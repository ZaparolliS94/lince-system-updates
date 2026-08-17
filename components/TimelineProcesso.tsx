export interface EtapaProcesso {
  nome: string;
  status: "concluida" | "atual" | "futura";
  data?: string; // ex: "Concluída em 02/06"
}

export default function TimelineProcesso({ etapas }: { etapas: EtapaProcesso[] }) {
  return (
    <div className="mb-4">
      {etapas.map((etapa, i) => {
        const ultima = i === etapas.length - 1;
        const corBolinha =
          etapa.status === "concluida"
            ? "#1E8E5A"
            : etapa.status === "atual"
            ? "#E69628"
            : "#E2E4E9";
        const corLinha =
          etapa.status === "concluida" ? "#1E8E5A" : "#E2E4E9";

        return (
          <div key={etapa.nome} className="flex items-start gap-2.5">
            <div className="flex flex-col items-center">
              <div
                className="w-4 h-4 rounded-full shrink-0"
                style={{
                  backgroundColor: corBolinha,
                  border:
                    etapa.status === "atual" ? "3px solid #FFE8C2" : "none",
                }}
              />
              {!ultima && (
                <div
                  className="w-[2px] h-[26px]"
                  style={{ backgroundColor: corLinha }}
                />
              )}
            </div>
            <div className={ultima ? "" : "pb-0.5"}>
              <p
                className={`text-[11px] ${
                  etapa.status === "futura"
                    ? "text-gray-400"
                    : "text-[#0A1E3C]"
                } ${etapa.status === "atual" ? "font-semibold" : "font-medium"}`}
              >
                {etapa.nome}
              </p>
              {etapa.data && (
                <p
                  className="text-[9px] mt-0.5"
                  style={{
                    color: etapa.status === "atual" ? "#B9700D" : "#6B7280",
                  }}
                >
                  {etapa.data}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
