"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AllRatesData, AreaId } from "@/lib/types";
import { CURRENCIES, AREAS, AREA_IDS } from "@/lib/constants";
import CurrencyRow from "./CurrencyRow";

type Props = {
  data: AllRatesData;
};

export type ActiveTab = "sell" | "buy";

export default function RateComparisonTable({ data }: Props) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("sell");
  const [selectedArea, setSelectedArea] = useState<AreaId>("shibuya");
  const tArea = useTranslations("area");

  const areaConfig = AREAS[selectedArea];

  return (
    <div>
      {/* Area selector */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex bg-[#1E293B] rounded-full p-1 flex-wrap gap-0.5">
          {AREA_IDS.map((areaId) => (
            <button
              key={areaId}
              onClick={() => setSelectedArea(areaId)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                selectedArea === areaId
                  ? "bg-cyan-400 text-slate-900"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tArea(areaId)}
            </button>
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
            key={`${selectedArea}-${currency}`}
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
