
export enum AppLayer {
  CUSTOMER_INSPECTION = 1,
  PROVIDER_INPUT = 2,
  PAYMENT = 3
}

export interface ItemReport {
  id: string;
  name: string;
  type: 'damage' | 'lost' | '';
  remarks: string;
}

export interface InspectionData {
  customerName: string;
  item1: boolean;
  item2: 'none' | 'resolved' | 'claimed';
  item2Details: ItemReport[];
  item3: 'none' | 'resolved' | 'claimed';
  item3Details: string;
  item4: 'saved' | 'no-need' | '';
  item5: boolean;
  item6: boolean;
  signature: string | null;
}

export interface PaymentData {
  serviceAmount: number;
  deposit: number;
  overtimeHours: number;
  overtimeAmount: number;
  balanceDue: number;
}
