
import React, { useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { X } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureDataUrl: string) => void;
}

const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose, onSave }) => {
  const sigCanvas = useRef<SignatureCanvas | null>(null);

  if (!isOpen) return null;

  const handleClear = () => {
    sigCanvas.current?.clear();
  };

  const handleSave = () => {
    if (sigCanvas.current?.isEmpty()) {
      alert('請先進行簽名');
      return;
    }
    const dataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
    if (dataUrl) {
      onSave(dataUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-xl overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-[#616130]">客戶電子簽名</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="p-4 bg-gray-50">
          <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white overflow-hidden">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="#616130"
              canvasProps={{
                className: "w-full h-64 cursor-crosshair",
                style: { width: '100%', height: '256px' }
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">請在上方區域簽署您的姓名</p>
        </div>
        <div className="flex gap-2 p-4">
          <button
            onClick={handleClear}
            className="flex-1 py-3 px-4 border border-[#949449] text-[#949449] rounded-lg font-medium hover:bg-gray-50 transition"
          >
            清除重新簽名
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 bg-[#949449] text-white rounded-lg font-medium hover:opacity-90 transition"
          >
            確認儲存簽名
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;
