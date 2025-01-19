'use client';

import { useState } from 'react';
import { FixedDepositForm } from './FixedDepositForm';
import { InternationalTransferForm } from './InternationalTransferForm';
import { BillPaymentForm } from './BillPaymentForm';
import { TaxPaymentForm } from './TaxPaymentForm';
import { Transaction } from '@/types/auth';

const SERVICES = [
  { id: 'fixed_deposit', name: 'Fixed Deposit', icon: '🏦' },
  { id: 'international', name: 'International Transfer', icon: '🌍' },
  { id: 'bills', name: 'Bill Payment', icon: '📃' },
  { id: 'tax', name: 'Tax Payment', icon: '💰' },
] as const;

type TransactionData = {
  type: Transaction['type'];
  amount: number;
  description: string;
  status: Transaction['status'];
  metadata?: Record<string, unknown>;
};

interface FinancialServicesProps {
  onTransaction: (data: TransactionData) => Promise<void>;
}

export function FinancialServices({ onTransaction }: FinancialServicesProps) {
  const [activeService, setActiveService] = useState<typeof SERVICES[number]['id']>('fixed_deposit');

  const handleFixedDeposit = async (data: {
    type: 'fixed_deposit';
    amount: number;
    duration: number;
    interestRate: number;
  }) => {
    await onTransaction({
      type: 'fixed_deposit',
      amount: data.amount,
      description: `Fixed Deposit for ${data.duration} months at ${data.interestRate}% p.a.`,
      status: 'pending',
      metadata: {
        duration: data.duration,
        interestRate: data.interestRate,
        maturityDate: new Date(Date.now() + data.duration * 30 * 24 * 60 * 60 * 1000),
      },
    });
  };

  const handleInternationalTransfer = async (data: {
    type: 'international_transfer';
    amount: number;
    recipientName: string;
    recipientBank: string;
    recipientCountry: string;
    swiftCode: string;
    accountNumber: string;
    currency: string;
  }) => {
    await onTransaction({
      type: 'international_transfer',
      amount: data.amount,
      description: `International Transfer to ${data.recipientName} (${data.recipientCountry})`,
      status: 'pending',
      metadata: {
        recipientName: data.recipientName,
        recipientBank: data.recipientBank,
        recipientCountry: data.recipientCountry,
        swiftCode: data.swiftCode,
        accountNumber: data.accountNumber,
        currency: data.currency,
        exchangeRate: 1, // This should come from an exchange rate API
      },
    });
  };

  const handleBillPayment = async (data: {
    type: 'bill_payment';
    amount: number;
    billType: 'electricity' | 'water' | 'gas' | 'internet' | 'phone';
    providerId: string;
    billNumber: string;
  }) => {
    await onTransaction({
      type: 'bill_payment',
      amount: data.amount,
      description: `Bill Payment - ${data.billType} (${data.billNumber})`,
      status: 'pending',
      metadata: {
        billType: data.billType,
        providerId: data.providerId,
        billNumber: data.billNumber,
      },
    });
  };

  const handleTaxPayment = async (data: {
    type: 'tax_payment';
    amount: number;
    taxType: 'income' | 'property' | 'sales' | 'corporate';
    taxYear: number;
    taxReference: string;
  }) => {
    await onTransaction({
      type: 'tax_payment',
      amount: data.amount,
      description: `${data.taxType} Tax Payment for Year ${data.taxYear}`,
      status: 'pending',
      metadata: {
        taxType: data.taxType,
        taxYear: data.taxYear,
        taxReference: data.taxReference,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {SERVICES.map((service) => (
          <button
            key={service.id}
            onClick={() => setActiveService(service.id)}
            className={`p-6 rounded-xl border transition-all ${
              activeService === service.id
                ? 'bg-primary text-white border-primary shadow-lg scale-105'
                : 'bg-white hover:bg-primary/5 border-gray-200'
            }`}
          >
            <span className="text-3xl mb-3 block">{service.icon}</span>
            <span className="font-medium">{service.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeService === 'fixed_deposit' && (
          <FixedDepositForm onSubmit={handleFixedDeposit} />
        )}
        {activeService === 'international' && (
          <InternationalTransferForm onSubmit={handleInternationalTransfer} />
        )}
        {activeService === 'bills' && (
          <BillPaymentForm onSubmit={handleBillPayment} />
        )}
        {activeService === 'tax' && (
          <TaxPaymentForm onSubmit={handleTaxPayment} />
        )}
      </div>
    </div>
  );
} 