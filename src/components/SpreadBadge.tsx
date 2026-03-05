import { useTranslations } from "next-intl";
import { getSpreadLevel, SpreadLevel } from "@/lib/spread";

type Props = {
  spreadPercent: number;
};

const LEVEL_STYLES: Record<SpreadLevel, string> = {
  good: "bg-emerald-500/20 text-emerald-400",
  normal: "bg-yellow-500/20 text-yellow-400",
  expensive: "bg-red-500/20 text-red-400",
};

export default function SpreadBadge({ spreadPercent }: Props) {
  const t = useTranslations("spread");
  const level = getSpreadLevel(spreadPercent);

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${LEVEL_STYLES[level]}`}
    >
      {spreadPercent > 0 ? "+" : ""}
      {spreadPercent.toFixed(1)}% {t(level)}
    </span>
  );
}
