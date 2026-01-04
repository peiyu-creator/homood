
import React from 'react';
import { PaymentData } from '../types';
import { DollarSign, Clock, ArrowRight, ArrowLeft, Calculator } from 'lucide-react';

interface ProviderLayerProps {
  data: PaymentData;
  setData: React.Dispatch<React.SetStateAction<PaymentData>>;
  onNext: () => void;
  onBack: () => void;
}

const ProviderLayer: React.FC<ProviderLayerProps> = ({ data, setData, onNext, onBack }) => {
  const OVERTIME_RATE = 800; // Updated to 800 per hour

  const updateCalculation = (service: number, hours: number) => {
    const deposit = service * 0.3;
    const overtimeAmount = OVERTIME_RATE * hours;
    // Updated: Balance Due = 70% of Service Amount + Overtime Amount
    const balanceDue = (service * 0.7) + overtimeAmount; 
    
    setData({
      serviceAmount: service,
      deposit: deposit,
      overtimeHours: hours,
      overtimeAmount: overtimeAmount,
      balanceDue: balanceDue,
    });
  };

  const handleOvertimeChange = (value: string) => {
    // Ensure it's an integer
    const hours = Math.floor(Number(value)) || 0;
    updateCalculation(data.serviceAmount, hours);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-[#616130]/20 overflow-hidden">
        <div className="bg-[#949449] p-4 text-white flex items-center justify-between">
          <h2 className="text-lg font-bold">服務金額結算 (服務人員填寫)</h2>
          <Calculator size={20} />
        </div>

        <div className="p-6 space-y-6 text-[#616130]">
          <div className="space-y-4">
            {/* Service Amount */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold">
                <DollarSign size={18} /> 1. 服務總金額
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                <input
                  type="number"
                  value={data.serviceAmount || ''}
                  onChange={(e) => updateCalculation(Number(e.target.value), data.overtimeHours)}
                  placeholder="請輸入總金額"
                  className="w-full pl-8 pr-4 py-3 border border-[#616130]/30 rounded-xl focus:ring-2 focus:ring-[#949449] outline-none"
                />
              </div>
            </div>

            {/* Auto Deposit Display */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center text-[#616130]/80">
                <span className="text-sm font-medium">2. 訂金 (總額 x 0.3)</span>
                <span className="font-bold">${data.deposit.toLocaleString()}</span>
              </div>
            </div>

            {/* Overtime */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold">
                <Clock size={18} /> 3. 加時時數 ({OVERTIME_RATE}元/小時，請以1為單位)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={data.overtimeHours || ''}
                  onChange={(e) => handleOvertimeChange(e.target.value)}
                  placeholder="輸入整數時數"
                  className="flex-1 px-4 py-3 border border-[#616130]/30 rounded-xl focus:ring-2 focus:ring-[#949449] outline-none"
                />
                <div className="w-1/3 text-right font-bold text-[#949449]">
                  + ${data.overtimeAmount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Balance Due Result */}
          <div className="mt-8 p-6 bg-[#FFAD86] rounded-2xl border-2 border-[#616130]/10 shadow-inner">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[#616130] font-bold text-sm uppercase tracking-wider">應付尾款金額</span>
              <span className="text-3xl font-black text-[#616130]">$ {data.balanceDue.toLocaleString()}</span>
              <span className="text-xs text-[#616130]/60">(服務金額 70% + 加時費用)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 py-4 bg-white border-2 border-[#949449] text-[#949449] rounded-xl font-bold shadow-sm active:scale-95 transition"
        >
          <ArrowLeft size={20} /> 返回修改驗收
        </button>
        <button
          onClick={onNext}
          className="flex items-center justify-center gap-2 py-4 bg-[#949449] text-white rounded-xl font-bold shadow-md hover:opacity-90 active:scale-95 transition"
        >
          下一步：收款 <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProviderLayer;
