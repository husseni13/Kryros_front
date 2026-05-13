import React, { createContext, useContext, useState } from "react";

export type Currency = {
  code: string;
  symbol: string;
  label: string;
  flag: string;
  rate: number;
};

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$",     label: "US Dollar",          flag: "🇺🇸", rate: 1 },
  { code: "ZMW", symbol: "ZMW ", label: "Zambian Kwacha",     flag: "🇿🇲", rate: 27.5 },
  { code: "NGN", symbol: "₦",    label: "Nigerian Naira",      flag: "🇳🇬", rate: 1620 },
  { code: "GHS", symbol: "GH₵ ", label: "Ghanaian Cedi",       flag: "🇬🇭", rate: 16.2 },
  { code: "KES", symbol: "KES ", label: "Kenyan Shilling",     flag: "🇰🇪", rate: 130 },
  { code: "ZAR", symbol: "R ",   label: "South African Rand",  flag: "🇿🇦", rate: 18.8 },
  { code: "EUR", symbol: "€",    label: "Euro",                flag: "🇪🇺", rate: 0.92 },
  { code: "GBP", symbol: "£",    label: "British Pound",       flag: "🇬🇧", rate: 0.79 },
];

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (usdAmount: number) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);

  const formatPrice = (usdAmount: number): string => {
    const converted = Math.round(usdAmount * currency.rate);
    return `${currency.symbol}${converted.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
