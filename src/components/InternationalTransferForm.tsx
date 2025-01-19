'use client';

import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

// Mock exchange rates (in production, these would come from an API)
const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.5,
  AUD: 1.35,
  CAD: 1.25,
};

interface InternationalTransferFormProps {
  onSubmit: (data: {
    type: 'international_transfer';
    amount: number;
    recipientName: string;
    recipientBank: string;
    recipientCountry: string;
    swiftCode: string;
    accountNumber: string;
    currency: keyof typeof EXCHANGE_RATES;
  }) => Promise<void>;
}

export function InternationalTransferForm({ onSubmit }: InternationalTransferFormProps) {
  const [amount, setAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientBank, setRecipientBank] = useState('');
  const [recipientCountry, setRecipientCountry] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [currency, setCurrency] = useState<keyof typeof EXCHANGE_RATES>('USD');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const convertedAmount = parseFloat(amount) * EXCHANGE_RATES[currency];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      setIsLoading(false);
      return;
    }

    if (!swiftCode.match(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/)) {
      setError('Invalid SWIFT/BIC code');
      setIsLoading(false);
      return;
    }

    try {
      await onSubmit({
        type: 'international_transfer',
        amount: numAmount,
        recipientName,
        recipientBank,
        recipientCountry,
        swiftCode,
        accountNumber,
        currency,
      });
      
      // Reset form
      setAmount('');
      setRecipientName('');
      setRecipientBank('');
      setRecipientCountry('');
      setSwiftCode('');
      setAccountNumber('');
      setCurrency('USD');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transfer failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">International Money Transfer</h2>
        
        {error && (
          <div className="bg-error/10 text-error rounded-lg p-3">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              min="0"
              step="0.01"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as keyof typeof EXCHANGE_RATES)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {Object.entries(EXCHANGE_RATES).map(([code, rate]) => (
                <option key={code} value={code}>
                  {code} (1 USD = {rate} {code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Recipient Name
          </label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Recipient Bank
          </label>
          <input
            type="text"
            value={recipientBank}
            onChange={(e) => setRecipientBank(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Recipient Country
          </label>
          <input
            type="text"
            value={recipientCountry}
            onChange={(e) => setRecipientCountry(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">
              SWIFT/BIC Code
            </label>
            <input
              type="text"
              value={swiftCode}
              onChange={(e) => setSwiftCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              pattern="^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$"
              placeholder="BOFAUS3N"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1">
              Account Number
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>
        </div>

        {amount && (
          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Transfer Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted">You Send</p>
                <p className="font-medium">${parseFloat(amount).toFixed(2)} USD</p>
              </div>
              <div>
                <p className="text-muted">Recipient Gets</p>
                <p className="font-medium text-success">
                  {convertedAmount.toFixed(2)} {currency}
                </p>
              </div>
              <div>
                <p className="text-muted">Exchange Rate</p>
                <p className="font-medium">1 USD = {EXCHANGE_RATES[currency]} {currency}</p>
              </div>
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full"
        >
          Send Money
        </Button>
      </form>
    </Card>
  );
} 