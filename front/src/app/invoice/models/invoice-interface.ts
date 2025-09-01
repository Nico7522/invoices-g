export interface Invoice {
  id: string;
  clientId: string;
  totalExclPrice: number;
  taxAmount: number;
  taxRate: number;
  totalInclPrice: number;
  laborCostExclPrice: number;
  otherFeesExclPrice?: number;
  createdAt: string;
  updatedAt: string;
}
