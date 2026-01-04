
import React from 'react';
import { PaymentData } from '../types';
import { QRCodeCanvas } from 'qrcode.react';
import { CreditCard, ArrowLeft, MessageSquare, Info, ExternalLink } from 'lucide-react';

interface PaymentLayerProps {
  paymentData: PaymentData;
  onBack: () => void;
}

const PaymentLayer: React.FC<PaymentLayerProps> = ({ paymentData, onBack }) => {
  const paymentUrl = "https://core.newebpay.com/EPG/20200430/56EDKV";

  const handleProceedToPayment = () => {
    window.open(paymentUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-lg border border-[#616130]/20 overflow-hidden">
        <div className="bg-[#949449] p-4 text-white flex items-center justify-between">
          <h2 className="text-lg font-bold">確認付款</h2>
          <CreditCard size={20} />
        </div>

        <div className="p-8 flex flex-col items-center text-[#616130]">
          <div className="mb-8 p-6 bg-[#FFAD86] rounded-2xl w-full text-center border-2 border-[#616130]/10">
            <p className="text-sm font-bold opacity-80 mb-1">本次服務應收尾款</p>
            <p className="text-4xl font-black">$ {paymentData.balanceDue.toLocaleString()}</p>
          </div>

          <div className="mb-8 flex flex-col items-center gap-4">
            <div className="p-4 bg-white rounded-2xl shadow-lg border-4 border-[#949449]/10">
              <QRCodeCanvas 
                value={paymentUrl} 
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-sm font-medium text-gray-500 text-center">
              請使用手機相機掃描上方 QR Code <br/> 或點擊下方按鈕前往付款
            </p>
          </div>

          {/* New Direct Payment Button */}
          <button
            onClick={handleProceedToPayment}
            className="w-full mb-8 flex items-center justify-center gap-2 py-4 bg-[#949449] text-white rounded-xl font-bold shadow-lg hover:opacity-90 active:scale-[0.98] transition-all transform"
          >
            <ExternalLink size={20} /> 立即前往藍新頁面付款
          </button>

          <div className="w-full space-y-4">
            <div className="flex items-start gap-3 p-4 bg-[#e3e6df]/50 rounded-xl border border-[#616130]/10">
              <MessageSquare className="text-[#949449] mt-0.5" size={20} />
              <p className="text-sm leading-relaxed">
                <span className="font-bold">溫馨提示：</span><br/>
                付款完成後請<span className="text-[#949449] font-bold">截圖畫面</span>並傳至<span className="text-[#949449] font-bold">「居家整聊室」官方LINE</span>，以便為您核對帳務。
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <Info className="text-gray-400" size={20} />
              <div className="text-xs text-gray-500">
                <p>訂金：${paymentData.deposit.toLocaleString()}</p>
                <p>加時：${paymentData.overtimeAmount.toLocaleString()} ({paymentData.overtimeHours}小時)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onBack}
        className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-[#949449] text-[#949449] rounded-xl font-bold shadow-sm active:scale-95 transition"
      >
        <ArrowLeft size={20} /> 返回明細頁面
      </button>

      <div className="px-6 text-center">
        <p className="text-xs text-gray-400 italic">
          交易環境受 TLS 1.2 加密保護，請安心支付
        </p>
      </div>
    </div>
  );
};

export default PaymentLayer;
