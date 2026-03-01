import React, { createContext, useContext, useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SUPPORTED_CURRENCIES, getCurrencySymbol } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from '@/db/api';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  convertPrice: (priceEur: number) => number;
  formatPrice: (priceEur: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const [currency, setCurrencyState] = useState<string>(profile?.currency_pref || 'EUR');
  const [rates, setRates] = useState<Record<string, number>>({});

  useEffect(() => {
    if (profile?.currency_pref) {
      setCurrencyState(profile.currency_pref);
    }
  }, [profile]);

  useEffect(() => {
    // Load currency rates from localStorage or fetch
    const storedRates = localStorage.getItem('currency_rates');
    if (storedRates) {
      setRates(JSON.parse(storedRates));
    } else {
      // Initialize with default rates
      const defaultRates: Record<string, number> = {
        EUR: 1.0,
        USD: 1.08,
        GBP: 0.85,
        BGN: 1.96,
        RON: 4.97,
        TRY: 36.50,
        CHF: 0.94,
        SEK: 11.30,
        NOK: 11.80,
        DKK: 7.46,
        CZK: 24.50,
        PLN: 4.30,
        HUF: 395.00,
      };
      setRates(defaultRates);
      localStorage.setItem('currency_rates', JSON.stringify(defaultRates));
    }
  }, []);

  const setCurrency = async (newCurrency: string) => {
    setCurrencyState(newCurrency);
    if (user && profile) {
      await updateProfile(user.id, { currency_pref: newCurrency });
    }
  };

  const convertPrice = (priceEur: number): number => {
    const rate = rates[currency] || 1;
    return priceEur * rate;
  };

  const formatPrice = (priceEur: number): string => {
    const converted = convertPrice(priceEur);
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${converted.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};

export const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <Select value={currency} onValueChange={setCurrency}>
      <SelectTrigger className="w-[100px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_CURRENCIES.map((curr) => (
          <SelectItem key={curr.code} value={curr.code}>
            {curr.symbol} {curr.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
