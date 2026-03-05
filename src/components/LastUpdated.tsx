import { useTranslations } from "next-intl";

type Props = {
  generatedAt: string;
};

export default function LastUpdated({ generatedAt }: Props) {
  const t = useTranslations();

  const date = new Date(generatedAt);
  const formatted = date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tokyo",
  });

  return (
    <p className="text-sm text-gray-500">
      {t("lastUpdated")}: {formatted} (JST)
    </p>
  );
}
