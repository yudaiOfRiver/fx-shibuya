import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-[#1E293B] border-t border-slate-700 mt-12">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <p className="text-xs text-slate-400 leading-relaxed">
          {t("disclaimer")}
        </p>
        <p className="text-xs text-slate-500 mt-2">{t("copyright")}</p>
      </div>
    </footer>
  );
}
