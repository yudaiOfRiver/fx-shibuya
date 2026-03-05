"use client";

import { useState } from "react";
import { AllRatesData } from "@/lib/types";
import { CURRENCIES } from "@/lib/constants";
import CurrencyRow from "./CurrencyRow";

type Props = {
  data: AllRatesData;
};

export type ActiveTab = "sell" | "buy";

export default function RateComparisonTable({ data }: Props) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("sell");

  return (
    <div>
      {/* Pill switcher */}
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
            key={currency}
            currency={currency}
            market={data.market}
            shops={data.shops}
            activeTab={activeTab}
          />
        ))}
      </div>
    </div>
  );
}
