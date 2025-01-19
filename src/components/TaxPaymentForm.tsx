'use client';

import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

const TAX_TYPES = [
  { id: 'income', name: 'Income Tax', icon: '💰' },
  { id: 'property', name: 'Property Tax', icon: '🏠' },
  { id: 'sales', name: 'Sales Tax', icon: '🛍️' },
  { id: 'corporate', name: 'Corporate Tax', icon: '🏢' },
] as const;

interface TaxPaymentFormProps {
  onSubmit: (data: {
    type: 'tax_payment';
    amount: number;
    taxType: typeof TAX_TYPES[number]['id'];
    taxYear: number;
    taxReference: string;
  }) => Promise<void>;
}

export function TaxPaymentForm({ onSubmit }: TaxPaymentFormProps) {
  const [amount, setAmount] = useState('');
  const [taxType, setTaxType] = useState<typeof TAX_TYPES[number]['id']>('income');
  const [taxYear, setTaxYear] = useState(new Date().getFullYear());
  const [taxReference, setTaxReference] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

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

    try {
      await onSubmit({
        type: 'tax_payment',
        amount: numAmount,
        taxType,
        taxYear,
        taxReference,
      });
      
      // Reset form
      setAmount('');
      setTaxType('income');
      setTaxYear(new Date().getFullYear());
      setTaxReference('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">Pay Taxes</h2>
        
        {error && (
          <div className="bg-error/10 text-error rounded-lg p-3">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TAX_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setTaxType(type.id)}
              className={`p-4 rounded-lg border text-center transition-colors ${
                taxType === type.id
                  ? 'bg-primary text-white border-primary'
                  : 'hover:bg-primary/5 border-gray-200'
              }`}
            >
              <span className="text-2xl mb-2 block">{type.icon}</span>
              <span className="text-sm font-medium">{type.name}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">
              Tax Year
            </label>
            <select
              value={taxYear}
              onChange={(e) => setTaxYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1">
              Tax Reference Number
            </label>
            <input
              type="text"
              value={taxReference}
              onChange={(e) => setTaxReference(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Enter reference number"
              required
            />
          </div>
        </div>

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

        {amount && (
          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Tax Type</span>
                <span className="font-medium">
                  {TAX_TYPES.find(t => t.id === taxType)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Tax Year</span>
                <span className="font-medium">{taxYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Reference Number</span>
                <span className="font-medium">{taxReference}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="text-muted">Total Amount</span>
                <span className="font-medium text-success">
                  ${parseFloat(amount).toFixed(2)}
                </span>
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
          Pay Tax
        </Button>
      </form>
    </Card>
  );
} 