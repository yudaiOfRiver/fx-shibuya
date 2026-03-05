import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const t = useTranslations("header");

  return (
    <header className="bg-[#1E293B] border-b border-slate-700 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-50 sm:text-2xl">
            {t("title")}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">{t("subtitle")}</p>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
