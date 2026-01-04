
import React, { useState, useEffect } from 'react';
import { AppLayer, InspectionData, PaymentData } from './types';
import CustomerLayer from './components/CustomerLayer';
import ProviderLayer from './components/ProviderLayer';
import PaymentLayer from './components/PaymentLayer';

const App: React.FC = () => {
  const [currentLayer, setCurrentLayer] = useState<AppLayer>(AppLayer.CUSTOMER_INSPECTION);
  
  // Inspection State
  const [inspection, setInspection] = useState<InspectionData>({
    customerName: '',
    item1: false,
    item2: 'none',
    item2Details: [],
    item3: 'none',
    item3Details: '',
    item4: '',
    item5: false,
    item6: false,
    signature: null,
  });

  // Payment State
  const [payment, setPayment] = useState<PaymentData>({
    serviceAmount: 0,
    deposit: 0,
    overtimeHours: 0,
    overtimeAmount: 0,
    balanceDue: 0,
  });

  // URL Pre-fill logic
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || window.location.search);
    const nameFromUrl = params.get('name');
    if (nameFromUrl) {
      setInspection(prev => ({ ...prev, customerName: nameFromUrl }));
    }
  }, []);

  const handleNextLayer = () => {
    if (currentLayer === AppLayer.CUSTOMER_INSPECTION) {
      setCurrentLayer(AppLayer.PROVIDER_INPUT);
    } else if (currentLayer === AppLayer.PROVIDER_INPUT) {
      setCurrentLayer(AppLayer.PAYMENT);
    }
  };

  const handlePrevLayer = () => {
    if (currentLayer === AppLayer.PROVIDER_INPUT) {
      setCurrentLayer(AppLayer.CUSTOMER_INSPECTION);
    } else if (currentLayer === AppLayer.PAYMENT) {
      setCurrentLayer(AppLayer.PROVIDER_INPUT);
    }
  };

  return (
    <div className="min-h-screen pb-12 transition-colors duration-300">
      <header className="sticky top-0 z-40 bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-[#616130]/10">
        <h1 className="text-xl font-bold text-[#616130]">戶沐淨清潔服務系統</h1>
        <div className="flex items-center gap-1 text-xs">
          <div className={`w-3 h-3 rounded-full ${currentLayer >= 1 ? 'bg-[#949449]' : 'bg-gray-300'}`}></div>
          <div className="w-4 h-0.5 bg-gray-200"></div>
          <div className={`w-3 h-3 rounded-full ${currentLayer >= 2 ? 'bg-[#949449]' : 'bg-gray-300'}`}></div>
          <div className="w-4 h-0.5 bg-gray-200"></div>
          <div className={`w-3 h-3 rounded-full ${currentLayer >= 3 ? 'bg-[#949449]' : 'bg-gray-300'}`}></div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto mt-6 px-4">
        {currentLayer === AppLayer.CUSTOMER_INSPECTION && (
          <CustomerLayer 
            data={inspection} 
            setData={setInspection} 
            onNext={handleNextLayer} 
          />
        )}
        {currentLayer === AppLayer.PROVIDER_INPUT && (
          <ProviderLayer 
            data={payment} 
            setData={setPayment} 
            onNext={handleNextLayer} 
            onBack={handlePrevLayer}
          />
        )}
        {currentLayer === AppLayer.PAYMENT && (
          <PaymentLayer 
            paymentData={payment} 
            onBack={handlePrevLayer} 
          />
        )}
      </main>
      
      <footer className="mt-12 text-center text-[#616130]/60 text-sm">
        &copy; 2024 戶沐淨 / 居家整聊股份有限公司
      </footer>
    </div>
  );
};

export default App;
