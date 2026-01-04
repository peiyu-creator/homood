
import React, { useState, useRef } from 'react';
import { InspectionData, ItemReport } from '../types';
import SignatureModal from './SignatureModal';
import { Check, User, Camera, ShieldAlert, FileCheck, Download, Plus, Trash2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface CustomerLayerProps {
  data: InspectionData;
  setData: React.Dispatch<React.SetStateAction<InspectionData>>;
  onNext: () => void;
}

const CustomerLayer: React.FC<CustomerLayerProps> = ({ data, setData, onNext }) => {
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: keyof InspectionData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    const newItem: ItemReport = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      type: '',
      remarks: ''
    };
    setData(prev => ({ ...prev, item2Details: [...prev.item2Details, newItem] }));
  };

  const removeItem = (id: string) => {
    setData(prev => ({ ...prev, item2Details: prev.item2Details.filter(item => item.id !== id) }));
  };

  const updateItem = (id: string, field: keyof ItemReport, value: string) => {
    setData(prev => ({
      ...prev,
      item2Details: prev.item2Details.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleCapture = async () => {
    if (cardRef.current) {
      setIsCapturing(true);
      // Wait for re-render
      setTimeout(async () => {
        try {
          const canvas = await html2canvas(cardRef.current!, {
            backgroundColor: '#ffffff',
            scale: 3, // Increased scale for better legibility
            useCORS: true,
            logging: false,
          });
          const link = document.createElement('a');
          link.download = `驗收單_${data.customerName || '未命名'}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        } catch (error) {
          console.error('Capture failed', error);
        } finally {
          setIsCapturing(false);
        }
      }, 100);
    }
  };

  const isItem2Valid = data.item2 === 'claimed' ? data.item2Details.length > 0 && data.item2Details.every(i => i.name) : !!data.item2;
  const isValid = data.customerName && data.item1 && isItem2Valid && data.item3 && data.item4 && data.item5 && data.signature;

  // Helper to render text instead of input during capture for better legibility
  const RenderField = ({ value, placeholder, isTextArea = false }: { value: string, placeholder: string, isTextArea?: boolean }) => {
    if (isCapturing) {
      return (
        <div className={`w-full px-4 py-3 border border-[#616130]/30 rounded-xl bg-white min-h-[3rem] ${isTextArea ? 'h-auto whitespace-pre-wrap' : ''}`}>
          {value || <span className="text-gray-300">{placeholder}</span>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div 
        ref={cardRef}
        className="bg-white rounded-2xl shadow-lg border border-[#616130]/20 overflow-hidden"
      >
        <div className="bg-[#949449] p-5 text-white">
          <h2 className="text-xl font-bold">戶沐淨清潔服物驗收單</h2>
          <p className="text-sm opacity-90 mt-1">請仔細核對以下服務內容並勾選確認</p>
        </div>

        <div className="p-6 space-y-6 text-[#616130]">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold">
              <User size={18} /> 客戶姓名
            </label>
            {isCapturing ? (
              <RenderField value={data.customerName} placeholder="請輸入您的姓名" />
            ) : (
              <input
                type="text"
                value={data.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                placeholder="請輸入您的姓名"
                className="w-full px-4 py-3 border border-[#616130]/30 rounded-xl focus:ring-2 focus:ring-[#949449] outline-none transition"
              />
            )}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-5">
            <p className="font-bold text-sm">驗收事項（確認驗收，請打勾）</p>

            {/* Item 1 */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="mt-1">
                <input
                  type="checkbox"
                  checked={data.item1}
                  onChange={(e) => handleInputChange('item1', e.target.checked)}
                  className="w-5 h-5 rounded border-[#616130]/30 text-[#949449] focus:ring-[#949449]"
                />
              </div>
              <span className="text-[15px] leading-relaxed">
                1. 今日服務，已如我所期望全數完成。
              </span>
            </label>

            {/* Item 2 */}
            <div className="space-y-3">
              <p className="text-sm font-bold flex items-center gap-2">
                <ShieldAlert size={18} className="text-[#949449]" /> 2. 物品狀況確認 (必選一項)
              </p>
              <div className="ml-8 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="item2"
                    checked={data.item2 === 'none'}
                    onChange={() => handleInputChange('item2', 'none')}
                    className="mt-1 w-4 h-4 text-[#949449] focus:ring-[#949449]"
                  />
                  <span className="text-sm">確認並無物品毀損、滅失情形，如有丟棄之物品，均經您確認同意丟棄。</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="item2"
                    checked={data.item2 === 'resolved'}
                    onChange={() => handleInputChange('item2', 'resolved')}
                    className="mt-1 w-4 h-4 text-[#949449] focus:ring-[#949449]"
                  />
                  <span className="text-sm">雖有發現物品毀損、滅失，但經回報居家整聊股份有限公司，雙方已解決爭議</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="item2"
                    checked={data.item2 === 'claimed'}
                    onChange={() => handleInputChange('item2', 'claimed')}
                    className="mt-1 w-4 h-4 text-[#949449] focus:ring-[#949449]"
                  />
                  <span className="text-sm">有發現物品毀損、滅失，並已回報居家整聊股份有限公司請求賠償。</span>
                </label>

                {data.item2 === 'claimed' && (
                  <div className="ml-0 md:ml-7 space-y-4 pt-2">
                    {data.item2Details.map((item, index) => (
                      <div key={item.id} className="p-4 bg-red-50 rounded-xl border border-red-100 space-y-3 relative">
                        {!isCapturing && (
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                        <div>
                          <label className="text-xs font-bold block mb-1">物品名稱 ({index + 1})</label>
                          {isCapturing ? (
                            <RenderField value={item.name} placeholder="請填寫物品名稱" />
                          ) : (
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg focus:ring-1 focus:ring-red-400 outline-none"
                              placeholder="請填寫物品名稱"
                            />
                          )}
                        </div>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="radio"
                              name={`type-${item.id}`}
                              checked={item.type === 'damage'}
                              onChange={() => updateItem(item.id, 'type', 'damage')}
                              className="text-red-500 focus:ring-red-500"
                            /> 毀損
                          </label>
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="radio"
                              name={`type-${item.id}`}
                              checked={item.type === 'lost'}
                              onChange={() => updateItem(item.id, 'type', 'lost')}
                              className="text-red-500 focus:ring-red-500"
                            /> 遺失
                          </label>
                        </div>
                        <div>
                          <label className="text-xs font-bold block mb-1">備註</label>
                          {isCapturing ? (
                            <RenderField value={item.remarks} placeholder="填寫具體毀損或遺失情形" isTextArea />
                          ) : (
                            <textarea
                              value={item.remarks}
                              onChange={(e) => updateItem(item.id, 'remarks', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg h-24 focus:ring-1 focus:ring-red-400 outline-none resize-none"
                              placeholder="填寫具體毀損或遺失情形"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    {!isCapturing && (
                      <button
                        onClick={addItem}
                        className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition font-bold text-sm"
                      >
                        <Plus size={18} /> 新增其他物品
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Item 3 */}
            <div className="space-y-3">
              <p className="text-sm font-bold flex items-center gap-2">
                <ShieldAlert size={18} className="text-[#949449]" /> 3. 服務人員行為確認 (必選一項)
              </p>
              <div className="ml-8 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="item3"
                    checked={data.item3 === 'none'}
                    onChange={() => handleInputChange('item3', 'none')}
                    className="mt-1 w-4 h-4 text-[#949449] focus:ring-[#949449]"
                  />
                  <span className="text-sm">服務過程中，現場服務人員並未對您或其他在場親友為任何騷擾或違法行為。</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="item3"
                    checked={data.item3 === 'resolved'}
                    onChange={() => handleInputChange('item3', 'resolved')}
                    className="mt-1 w-4 h-4 text-[#949449] focus:ring-[#949449]"
                  />
                  <span className="text-sm">雖有涉及騷擾或違法行為，但經回報居家整聊股份有限公司，雙方已解決爭議。</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="item3"
                    checked={data.item3 === 'claimed'}
                    onChange={() => handleInputChange('item3', 'claimed')}
                    className="mt-1 w-4 h-4 text-[#949449] focus:ring-[#949449]"
                  />
                  <span className="text-sm">有涉及騷擾或違法行為，經回報居家整聊股份有限公司請求賠償。</span>
                </label>
                {data.item3 === 'claimed' && (
                  <div className="ml-7 p-3 bg-red-50 rounded-xl border border-red-100">
                    <label className="text-xs font-bold block mb-1">具體情形：</label>
                    {isCapturing ? (
                      <RenderField value={data.item3Details} placeholder="請描述具體情形" isTextArea />
                    ) : (
                      <textarea
                        value={data.item3Details}
                        onChange={(e) => handleInputChange('item3Details', e.target.value)}
                        className="w-full px-3 py-2 text-sm border rounded-lg h-24 resize-none focus:ring-1 focus:ring-red-400 outline-none"
                        placeholder="請描述具體情形"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Item 4 */}
            <div className="space-y-3">
              <p className="text-sm font-bold flex items-center gap-2">
                <Camera size={18} className="text-[#949449]" /> 4. 服務紀錄照片 (必選一項)
              </p>
              <div className="ml-8 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="item4"
                    checked={data.item4 === 'saved'}
                    onChange={() => handleInputChange('item4', 'saved')}
                    className="mt-1 w-4 h-4 text-[#949449] focus:ring-[#949449]"
                  />
                  <span className="text-sm">公司已拍攝服務前、後照片，並以官方LINE傳給我留存</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="item4"
                    checked={data.item4 === 'no-need'}
                    onChange={() => handleInputChange('item4', 'no-need')}
                    className="mt-1 w-4 h-4 text-[#949449] focus:ring-[#949449]"
                  />
                  <span className="text-sm">我不需留存照片</span>
                </label>
              </div>
            </div>

            {/* Item 5 */}
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="mt-1">
                <input
                  type="checkbox"
                  checked={data.item5}
                  onChange={(e) => handleInputChange('item5', e.target.checked)}
                  className="w-5 h-5 rounded border-[#616130]/30 text-[#949449]"
                />
              </div>
              <span className="text-sm">
                5. 已確認所拍攝服務前、後照片或影像，並未牽涉我個人隱私場域或物品
              </span>
            </label>

            {/* Item 6 */}
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="mt-1">
                <input
                  type="checkbox"
                  checked={data.item6}
                  onChange={(e) => handleInputChange('item6', e.target.checked)}
                  className="w-5 h-5 rounded border-[#616130]/30 text-[#949449]"
                />
              </div>
              <span className="text-sm text-gray-500 italic">
                我同意戶沐淨/居家整聊股份有限公司，以不洩漏我個人資料（姓名、住址、連絡電話）之方式，將本案實施服務前、後照片 or 影像等紀錄，作為行銷案例分享、相關課程教材使用。
              </span>
            </label>

            {/* Item 7 - Signature */}
            <div className="pt-6 border-t border-gray-100">
              <p className="text-sm font-bold mb-4">7. 上述各項均驗收完成，請服務客戶簽名：</p>
              <div 
                onClick={() => !isCapturing && setIsSigModalOpen(true)}
                className={`w-full h-40 border-2 border-dashed border-[#616130]/30 rounded-xl flex items-center justify-center bg-gray-50 transition relative group ${isCapturing ? '' : 'cursor-pointer hover:bg-gray-100'}`}
              >
                {data.signature ? (
                  <img src={data.signature} alt="Signature" className="max-h-full max-w-full p-2" />
                ) : (
                  <div className="text-center">
                    <FileCheck className="mx-auto mb-2 text-gray-400 group-hover:text-[#949449]" />
                    <span className="text-sm text-gray-400 font-medium group-hover:text-[#949449]">點擊進行電子簽名</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleCapture}
          className="flex items-center justify-center gap-2 py-4 bg-white border-2 border-[#949449] text-[#949449] rounded-xl font-bold shadow-sm active:scale-95 transition"
        >
          <Camera size={20} /> 下載截圖
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`flex items-center justify-center gap-2 py-4 rounded-xl font-bold shadow-md transition active:scale-95 ${
            isValid ? 'bg-[#949449] text-white hover:opacity-90' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Check size={20} /> 確認並結算
        </button>
      </div>

      <SignatureModal
        isOpen={isSigModalOpen}
        onClose={() => setIsSigModalOpen(false)}
        onSave={(sig) => handleInputChange('signature', sig)}
      />
    </div>
  );
};

export default CustomerLayer;
