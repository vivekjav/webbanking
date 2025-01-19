'use client';

import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

const BILL_TYPES = [
  { id: 'electricity', name: 'Electricity', icon: '⚡' },
  { id: 'water', name: 'Water', icon: '💧' },
  { id: 'gas', name: 'Gas', icon: '🔥' },
  { id: 'internet', name: 'Internet', icon: '🌐' },
  { id: 'phone', name: 'Phone', icon: '📱' },
] as const;

// Mock bill providers (in production, these would come from an API)
const BILL_PROVIDERS = {
  electricity: [
    { id: 'e1', name: 'City Power Co.' },
    { id: 'e2', name: 'National Grid' },
  ],
  water: [
    { id: 'w1', name: 'City Water Works' },
    { id: 'w2', name: 'Regional Water' },
  ],
  gas: [
    { id: 'g1', name: 'National Gas' },
    { id: 'g2', name: 'City Gas Supply' },
  ],
  internet: [
    { id: 'i1', name: 'Fiber Connect' },
    { id: 'i2', name: 'Speed Net' },
  ],
  phone: [
    { id: 'p1', name: 'Mobile Plus' },
    { id: 'p2', name: 'TeleCom' },
  ],
};

interface BillPaymentFormProps {
  onSubmit: (data: {
    type: 'bill_payment';
    amount: number;
    billType: typeof BILL_TYPES[number]['id'];
    providerId: string;
    billNumber: string;
  }) => Promise<void>;
}

export function BillPaymentForm({ onSubmit }: BillPaymentFormProps) {
  const [amount, setAmount] = useState('');
  const [billType, setBillType] = useState<typeof BILL_TYPES[number]['id']>('electricity');
  const [providerId, setProviderId] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        type: 'bill_payment',
        amount: numAmount,
        billType,
        providerId,
        billNumber,
      });
      
      // Reset form
      setAmount('');
      setBillType('electricity');
      setProviderId('');
      setBillNumber('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">Pay Bills</h2>
        
        {error && (
          <div className="bg-error/10 text-error rounded-lg p-3">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {BILL_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setBillType(type.id)}
              className={`p-4 rounded-lg border text-center transition-colors ${
                billType === type.id
                  ? 'bg-primary text-white border-primary'
                  : 'hover:bg-primary/5 border-gray-200'
              }`}
            >
              <span className="text-2xl mb-2 block">{type.icon}</span>
              <span className="text-sm font-medium">{type.name}</span>
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Service Provider
          </label>
          <select
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            required
          >
            <option value="">Select provider</option>
            {BILL_PROVIDERS[billType].map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Bill Number
          </label>
          <input
            type="text"
            value={billNumber}
            onChange={(e) => setBillNumber(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Enter your bill number"
            required
          />
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

        {amount && providerId && (
          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Bill Type</span>
                <span className="font-medium">
                  {BILL_TYPES.find(t => t.id === billType)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Provider</span>
                <span className="font-medium">
                  {BILL_PROVIDERS[billType].find(p => p.id === providerId)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Bill Number</span>
                <span className="font-medium">{billNumber}</span>
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
          Pay Bill
        </Button>
      </form>
    </Card>
  );
} 