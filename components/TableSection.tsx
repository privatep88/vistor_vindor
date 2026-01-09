import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { TableSectionProps, Record } from '../types.ts';

const TableSection: React.FC<TableSectionProps> = ({ title, data, icon: Icon, colorTheme, onEdit, onDelete }) => {
    const themeClasses = {
      blue: "bg-blue-50 border-blue-200 text-blue-800",
      purple: "bg-purple-50 border-purple-200 text-purple-800",
      orange: "bg-orange-50 border-orange-200 text-orange-800"
    };

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 mb-8 animate-fadeIn">
        <div className={`px-6 py-4 border-b border-slate-200 flex items-center justify-between ${themeClasses[colorTheme] || "bg-slate-100"}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/70 rounded-lg shadow-sm">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">{title} <span className="text-sm opacity-75">({data.length} سجل)</span></h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-24">إجراءات</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-12">م</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">السنة</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">التاريخ</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">اليوم</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">المقر</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">الاسم</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">الهاتف</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">الإدارة</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">الغرض</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">إثبات الهوية</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">التوقيت</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">الملاحظات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.length === 0 ? (
                <tr><td colSpan={13} className="px-6 py-8 text-center text-slate-500">لا توجد سجلات تطابق البحث</td></tr>
              ) : (
                data.map((record: Record, idx: number) => {
                  const dayName = new Date(record.date).toLocaleDateString('ar-AE', { weekday: 'long' });
                  return (
                    <tr key={record.id} className="hover:bg-slate-50 transition-colors duration-150 text-sm group">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                           <button onClick={() => onEdit(record)} className="text-slate-500 hover:text-blue-600 hover:bg-blue-100 p-2 rounded-full transition-all" title="تعديل السجل"><Pencil className="w-4 h-4" /></button>
                           <button onClick={() => onDelete(record.id)} className="text-slate-500 hover:text-red-600 hover:bg-red-100 p-2 rounded-full transition-all" title="حذف السجل"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-slate-500" dir="ltr">{idx + 1}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-black" dir="ltr">{record.year || new Date(record.date).getFullYear()}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-black" dir="ltr">{record.date}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-black">{dayName}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-black">{typeof record.location === 'string' ? record.location : ''}</td>
                      <td className="px-4 py-4 whitespace-nowrap font-medium text-black">{record.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-black" dir="ltr">{record.phone}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-black">{record.department}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-black">{record.purpose}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-black">{record.idType}</td>
                      <td className="px-4 py-4 whitespace-nowrap" dir="ltr">
                        <span className="text-green-600 font-medium">{record.timeIn}</span> 
                        {record.timeOut && <span className="text-slate-400 mx-1">➜</span>}
                        {record.timeOut && <span className="text-red-600 font-medium">{record.timeOut}</span>}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-black max-w-xs truncate" title={record.notes}>{record.notes}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
};

export default TableSection;