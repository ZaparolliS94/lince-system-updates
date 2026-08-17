import { calcularRegularidade, CORES_FAIXA, LicencaParaCalculo } from "@/lib/regularidade";

export default function RegularidadeCard({
  licencas,
}: {
  licencas: LicencaParaCalculo[];
}) {
  const { percentual, faixa, mensagem } = calcularRegularidade(licencas);
  const cores = CORES_FAIXA[faixa];

  return (
    <div
      className="rounded-xl p-4 mb-4"
      style={{ backgroundColor: cores.bg }}
    >
      <div className="flex items-baseline gap-2">
        <span
          className="text-[26px] font-semibold"
          style={{ color: cores.text }}
        >
          {percentual}%
        </span>
        <span className="text-xs" style={{ color: cores.text }}>
          regular
        </span>
      </div>
      <p className="text-[11px] mt-1" style={{ color: cores.text }}>
        {mensagem}
      </p>
    </div>
  );
}
