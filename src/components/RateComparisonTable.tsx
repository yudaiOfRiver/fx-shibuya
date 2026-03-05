import { AllRatesData } from "@/lib/types";
import { CURRENCIES } from "@/lib/constants";
import CurrencyRow from "./CurrencyRow";

type Props = {
  data: AllRatesData;
};

export default function RateComparisonTable({ data }: Props) {
  return (
    <div className="grid gap-4">
      {CURRENCIES.map((currency) => (
        <CurrencyRow
          key={currency}
          currency={currency}
          market={data.market}
          shops={data.shops}
        />
      ))}
    </div>
  );
}
