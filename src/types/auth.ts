interface BaseTransaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
  status: 'pending' | 'completed' | 'failed';
}

interface SimpleTransaction extends BaseTransaction {
  type: 'deposit' | 'withdrawal';
}

interface TransferTransaction extends BaseTransaction {
  type: 'transfer';
  recipientEmail: string;
}

interface FixedDepositTransaction extends BaseTransaction {
  type: 'fixed_deposit';
  metadata: {
    duration: number;
    interestRate: number;
    maturityDate: Date;
  };
}

interface InternationalTransferTransaction extends BaseTransaction {
  type: 'international_transfer';
  metadata: {
    recipientName: string;
    recipientBank: string;
    recipientCountry: string;
    swiftCode: string;
    accountNumber: string;
    currency: string;
    exchangeRate: number;
  };
}

interface BillPaymentTransaction extends BaseTransaction {
  type: 'bill_payment';
  metadata: {
    billType: 'electricity' | 'water' | 'gas' | 'internet' | 'phone';
    providerId: string;
    billNumber: string;
  };
}

interface TaxPaymentTransaction extends BaseTransaction {
  type: 'tax_payment';
  metadata: {
    taxType: 'income' | 'property' | 'sales' | 'corporate';
    taxYear: number;
    taxReference: string;
  };
}

export type Transaction = 
  | SimpleTransaction 
  | TransferTransaction 
  | FixedDepositTransaction 
  | InternationalTransferTransaction 
  | BillPaymentTransaction 
  | TaxPaymentTransaction;

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  balance: number;
  transactions: Transaction[];
  fixedDeposits?: {
    amount: number;
    startDate: Date;
    endDate: Date;
    interestRate: number;
    status: 'active' | 'matured' | 'withdrawn';
  }[];
}

export interface UserWithoutPassword {
  id: string;
  name: string;
  email: string;
  balance: number;
  transactions: Transaction[];
  fixedDeposits?: User['fixedDeposits'];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
} 