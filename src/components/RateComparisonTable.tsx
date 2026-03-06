"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AllRatesData, AreaId } from "@/lib/types";
import { CURRENCIES, AREAS, AREA_IDS } from "@/lib/constants";
import CurrencyRow from "./CurrencyRow";

type Props = {
  data: AllRatesData;
  defaultArea: AreaId;
};

export type ActiveTab = "sell" | "buy";

export default function RateComparisonTable({ data, defaultArea }: Props) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("sell");
  const tArea = useTranslations("area");

  const areaConfig = AREAS[defaultArea];

  return (
    <div>
      {/* Area selector (Link-based for SEO) */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex bg-[#1E293B] rounded-full p-1 flex-wrap gap-0.5">
          {AREA_IDS.map((areaId) => (
            <Link
              key={areaId}
              href={`/${areaId}`}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                defaultArea === areaId
                  ? "bg-cyan-400 text-slate-900"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tArea(areaId)}
            </Link>
          ))}
        </div>
      </div>

      {/* Sell/Buy pill switcher */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-[#1E293B] rounded-full p-1">
          <button
            onClick={() => setActiveTab("sell")}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${
              activeTab === "sell"
                ? "bg-cyan-400 text-slate-900"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            ¥ → $ € £ ₩
          </button>
          <button
            onClick={() => setActiveTab("buy")}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${
              activeTab === "buy"
                ? "bg-cyan-400 text-slate-900"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            $ € £ ₩ → ¥
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {CURRENCIES.map((currency) => (
          <CurrencyRow
            key={`${defaultArea}-${currency}`}
            currency={currency}
            market={data.market}
            shops={data.shops}
            areaShops={areaConfig.shops}
            activeTab={activeTab}
          />
        ))}
      </div>
    </div>
  );
}
