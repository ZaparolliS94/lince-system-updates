import Image from "next/image";

export default function ProgressoLince({ percentual }: { percentual: number }) {
  const p = Math.max(0, Math.min(100, percentual));

  return (
    <div className="relative h-[5px] w-full rounded-full bg-[#E2E4E9] overflow-visible">
      <div
        className="h-full rounded-full"
        style={{
          width: `${p}%`,
          background: "linear-gradient(90deg,#E69628,#E6AA28)",
        }}
      />
      <div
        className="absolute -top-[7px] animate-pulse"
        style={{ left: `calc(${p}% - 9px)` }}
      >
        <Image src="/lince-icon.png" alt="" width={18} height={18} aria-hidden="true" />
      </div>
    </div>
  );
}
