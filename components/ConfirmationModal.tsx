import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl p-6 m-4 max-w-sm w-full transform transition-all duration-300 scale-95 opacity-0 animate-modal-in"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
          <p className="text-sm text-slate-500 mb-6">{message}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={onClose} 
            className="w-full px-4 py-2 bg-slate-200 text-slate-800 font-medium rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-50 transition-colors"
          >
            إلغاء
          </button>
          <button 
            onClick={onConfirm}
            className="w-full px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
          >
            تأكيد الحذف
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;